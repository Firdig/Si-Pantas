import crypto from "crypto";
import { env } from "../config/env.js";
import { prisma } from "../config/database.js";

let testDispatchInterceptor = null;

export function setTestDispatchInterceptor(fn) {
  if (env.NODE_ENV === "test") {
    testDispatchInterceptor = fn;
  }
}

function buildTaskUrl(tokenPlaceholderOrRaw) {
  const baseUrl = env.FRONTEND_URL.replace(/\/+$/, "");
  return `${baseUrl}/collection/${tokenPlaceholderOrRaw}`;
}

/**
 * Membangun pesan WhatsApp berupa teks dan tautan saja (tanpa foto).
 */
export function buildCollectionMessage({ wastePointNames, taskUrl }) {
  const locationList = wastePointNames
    .map((name, idx) => `${idx + 1}. ${name}`)
    .join("\n");

  return [
    "Halo, TPS.",
    "",
    "Terdapat laporan pengangkutan sampah baru.",
    "",
    `Jumlah titik: ${wastePointNames.length}`,
    "",
    "Daftar lokasi:",
    locationList,
    "",
    "Silakan buka tautan berikut untuk melihat dan mengonfirmasi pengangkutan:",
    "",
    taskUrl,
    "",
    "Terima kasih.",
  ].join("\n");
}

async function dispatchToProvider({ recipientPhone, messageBody, redactedMessage, rawToken }) {
  if (env.NODE_ENV === "test" && typeof testDispatchInterceptor === "function") {
    return testDispatchInterceptor({ recipientPhone, messageBody, redactedMessage, rawToken });
  }

  if (env.WHATSAPP_PROVIDER === "mock") {
    const providerMessageId = `mock_${crypto.randomUUID()}`;
    if (env.NODE_ENV !== "test") {
      console.log(
        `[WhatsApp:MOCK] Mengirim pesan ke ${recipientPhone} (id=${providerMessageId}):\n${redactedMessage}`
      );
    }
    return {
      providerMessageId,
      // messageBody tetap diteruskan ke provider riil saat nanti diintegrasikan
      bytesSent: Buffer.byteLength(messageBody, "utf8"),
    };
  }

  throw new Error(`Provider WhatsApp '${env.WHATSAPP_PROVIDER}' belum diimplementasikan`);
}

/**
 * Mengirim 1 notifikasi WhatsApp untuk 1 grup laporan (collection task).
 * Tidak melempar error agar kegagalan WA tidak membatalkan laporan yang sudah tersimpan;
 * status dicatat pada tabel `whatsapp_logs`.
 * Token mentah TIDAK pernah disimpan ke database maupun log.
 */
export async function sendCollectionTaskNotification({
  collectionTaskId,
  recipientPhone,
  wastePointNames,
  rawToken,
  attemptCount = 1,
}) {
  const liveTaskUrl = buildTaskUrl(rawToken);
  const redactedTaskUrl = buildTaskUrl("[REDACTED]");

  const messageForProvider = buildCollectionMessage({
    wastePointNames,
    taskUrl: liveTaskUrl,
  });
  const redactedMessageForLog = buildCollectionMessage({
    wastePointNames,
    taskUrl: redactedTaskUrl,
  });

  const logRecord = await prisma.whatsappLog.create({
    data: {
      collectionTaskId,
      recipientPhone,
      messageBody: redactedMessageForLog,
      provider: env.WHATSAPP_PROVIDER,
      status: "QUEUED",
      attemptCount,
    },
  });

  try {
    const result = await dispatchToProvider({
      recipientPhone,
      messageBody: messageForProvider,
      redactedMessage: redactedMessageForLog,
      rawToken,
    });

    const updated = await prisma.whatsappLog.update({
      where: { id: logRecord.id },
      data: {
        status: "SENT",
        providerMessageId: result.providerMessageId,
        sentAt: new Date(),
      },
    });

    return {
      ok: true,
      log: updated,
    };
  } catch (error) {
    const updated = await prisma.whatsappLog.update({
      where: { id: logRecord.id },
      data: {
        status: "FAILED",
        errorMessage: error.message?.slice(0, 500) || "Gagal mengirim pesan WhatsApp",
      },
    });

    console.error(
      `[WhatsApp] Gagal mengirim notifikasi untuk task ${collectionTaskId}: ${error.message}`
    );

    return {
      ok: false,
      log: updated,
    };
  }
}
