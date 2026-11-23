import * as collectionService from "./collection.service.js";
import { sendSuccess } from "../../utils/response.js";

export async function getTask(req, res) {
  const data = await collectionService.getTaskByToken(req.validated.params.token);
  return sendSuccess(res, {
    message: "Data tugas pengangkutan berhasil diambil",
    data,
  });
}

export async function openTask(req, res) {
  const result = await collectionService.openTaskByToken(req.validated.params.token);
  return sendSuccess(res, {
    message: result.alreadyOpened
      ? "Tugas pengangkutan sudah pernah dibuka sebelumnya"
      : "Tugas pengangkutan berhasil dibuka dan status laporan diperbarui",
    data: result,
  });
}

export async function completeReport(req, res) {
  const result = await collectionService.completeReportByToken(
    req.validated.params.token,
    req.validated.params.id
  );
  return sendSuccess(res, {
    message: result.taskCompleted
      ? "Pengangkutan titik berhasil dikonfirmasi dan seluruh tugas grup selesai"
      : "Pengangkutan titik sampah berhasil dikonfirmasi",
    data: result,
  });
}

export async function listOperatorTasks(req, res) {
  const { items, meta } = await collectionService.listOperatorTasks(req.validated.query);
  return sendSuccess(res, {
    message: "Daftar tugas pengangkutan berhasil diambil",
    data: items,
    meta,
  });
}

export async function resendWhatsapp(req, res) {
  const data = await collectionService.resendWhatsappForTask(
    req.validated.params.id,
    req.user.id
  );
  return sendSuccess(res, {
    message: "Pengiriman ulang notifikasi WhatsApp diproses",
    data,
  });
}

export async function revokeTask(req, res) {
  const data = await collectionService.revokeTaskByOperator(
    req.validated.params.id,
    req.user.id
  );
  return sendSuccess(res, {
    message: "Tautan tugas pengangkutan berhasil dicabut",
    data,
  });
}
