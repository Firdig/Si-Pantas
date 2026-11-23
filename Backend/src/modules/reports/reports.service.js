import { prisma } from "../../config/database.js";
import { generateGroupAndReportCodes } from "../../utils/generate-code.js";
import { buildPaginationMeta, getPaginationOffsets } from "../../utils/pagination.js";
import {
  generateOpaqueToken,
  getTpsTaskExpiryDate,
  hashToken,
} from "../../services/token.service.js";
import { sendCollectionTaskNotification } from "../../services/whatsapp.service.js";
import { BadRequestError, ConflictError, NotFoundError } from "../../utils/app-error.js";

const STATUS_LABELS = {
  PENDING: "Dalam Antrean",
  IN_PROGRESS: "Proses Tindak Lanjut",
  COMPLETED: "Selesai",
};

function serializeReport(report) {
  return {
    ...report,
    statusLabel: STATUS_LABELS[report.status] || report.status,
    wastePoint: report.wastePoint
      ? {
          ...report.wastePoint,
          latitude:
            report.wastePoint.latitude !== undefined && report.wastePoint.latitude !== null
              ? Number(report.wastePoint.latitude)
              : null,
          longitude:
            report.wastePoint.longitude !== undefined && report.wastePoint.longitude !== null
              ? Number(report.wastePoint.longitude)
              : null,
        }
      : undefined,
  };
}

export async function createReportGroup({ items, tpsContactId }, actor) {
  const wastePointIds = items.map((item) => item.wastePointId);

  // 1. Validasi keberadaan & status aktif seluruh titik sampah
  const wastePoints = await prisma.wastePoint.findMany({
    where: { id: { in: wastePointIds }, isActive: true },
    select: { id: true, name: true, address: true },
  });

  if (wastePoints.length !== wastePointIds.length) {
    const foundIds = new Set(wastePoints.map((wp) => wp.id));
    const invalidIds = wastePointIds.filter((id) => !foundIds.has(id));
    throw new BadRequestError("Sebagian titik sampah tidak ditemukan atau tidak aktif", {
      invalidWastePointIds: invalidIds,
    });
  }

  const wastePointMap = new Map(wastePoints.map((wp) => [wp.id, wp]));

  // 2. Resolve kontak TPS (spesifik jika dikirim, atau fallback ke kontak TPS aktif pertama)
  let tpsContact;
  if (tpsContactId) {
    tpsContact = await prisma.tpsContact.findFirst({
      where: { id: tpsContactId, isActive: true },
    });
    if (!tpsContact) {
      throw new BadRequestError("Kontak TPS tidak ditemukan atau sedang tidak aktif");
    }
  } else {
    tpsContact = await prisma.tpsContact.findFirst({
      where: { isActive: true },
      orderBy: { createdAt: "asc" },
    });
    if (!tpsContact) {
      throw new BadRequestError("Belum ada kontak TPS aktif yang terdaftar di sistem");
    }
  }

  // 3. Siapkan token TPS kriptografis 256-bit (hanya hash yang disimpan di DB)
  const rawToken = generateOpaqueToken();
  const tokenHash = hashToken(rawToken);
  const expiresAt = getTpsTaskExpiryDate();

  // 4. Seluruh pembuatan grup, laporan, riwayat, tugas TPS, dan log dalam 1 transaksi atomik
  const createdData = await prisma.$transaction(async (tx) => {
    // Kunci baris waste_points yang dipilih agar pengecekan laporan aktif aman terhadap race condition
    const sortedIds = [...wastePointIds].sort();
    for (const wpId of sortedIds) {
      await tx.$executeRaw`SELECT id FROM waste_points WHERE id = ${wpId}::uuid FOR UPDATE`;
    }

    // Cegah duplikasi laporan aktif (PENDING / IN_PROGRESS) pada titik sampah yang sama
    const activeDuplicates = await tx.report.findMany({
      where: {
        wastePointId: { in: wastePointIds },
        status: { in: ["PENDING", "IN_PROGRESS"] },
      },
      select: {
        reportCode: true,
        status: true,
        wastePointId: true,
        wastePoint: { select: { name: true } },
      },
    });

    if (activeDuplicates.length > 0) {
      throw new ConflictError(
        "Beberapa titik sampah masih memiliki laporan aktif yang belum selesai",
        activeDuplicates.map((d) => ({
          wastePointId: d.wastePointId,
          wastePointName: d.wastePoint.name,
          activeReportCode: d.reportCode,
          status: d.status,
        }))
      );
    }

    const { groupCode, reportCodes } = await generateGroupAndReportCodes(tx, items.length);

    const group = await tx.reportGroup.create({
      data: {
        groupCode,
        createdById: actor.id,
      },
    });

    const createdReports = [];
    for (let i = 0; i < items.length; i += 1) {
      const item = items[i];
      const report = await tx.report.create({
        data: {
          reportCode: reportCodes[i],
          groupId: group.id,
          wastePointId: item.wastePointId,
          category: item.category ?? null,
          description: item.description ?? null,
          status: "PENDING",
          photos:
            item.photoKeys && item.photoKeys.length > 0
              ? {
                  create: item.photoKeys.map((storageKey) => ({ storageKey })),
                }
              : undefined,
          histories: {
            create: {
              changedById: actor.id,
              actorType: actor.role,
              oldStatus: null,
              newStatus: "PENDING",
              note: "Laporan dibuat",
            },
          },
        },
        include: {
          wastePoint: {
            select: { id: true, name: true, address: true },
          },
          photos: {
            select: { id: true, storageKey: true, createdAt: true },
          },
        },
      });
      createdReports.push(report);
    }

    const collectionTask = await tx.collectionTask.create({
      data: {
        groupId: group.id,
        tpsContactId: tpsContact.id,
        tokenHash,
        status: "ACTIVE",
        expiresAt,
      },
      select: {
        id: true,
        groupId: true,
        tpsContactId: true,
        status: true,
        expiresAt: true,
        createdAt: true,
      },
    });

    await tx.activityLog.create({
      data: {
        userId: actor.id,
        actorType: actor.role,
        action: "REPORT_GROUP_CREATE",
        entityType: "REPORT_GROUP",
        entityId: group.id,
      },
    });

    return {
      group,
      reports: createdReports,
      collectionTask,
    };
  });

  // 5. Kirim 1 notifikasi WhatsApp (teks & link, tanpa foto) SETELAH transaksi DB commit
  const orderedPointNames = items.map((item) => wastePointMap.get(item.wastePointId).name);
  const waResult = await sendCollectionTaskNotification({
    collectionTaskId: createdData.collectionTask.id,
    recipientPhone: tpsContact.phoneNumber,
    wastePointNames: orderedPointNames,
    rawToken,
  });

  return {
    id: createdData.group.id,
    groupCode: createdData.group.groupCode,
    createdAt: createdData.group.createdAt,
    reports: createdData.reports.map(serializeReport),
    collectionTask: {
      ...createdData.collectionTask,
      tpsContact: {
        id: tpsContact.id,
        name: tpsContact.name,
      },
    },
    whatsappNotification: {
      id: waResult.log.id,
      status: waResult.log.status,
      provider: waResult.log.provider,
      sentAt: waResult.log.sentAt,
      errorMessage: waResult.log.errorMessage,
    },
  };
}

export async function listReports(query) {
  const { page, limit, skip, take } = getPaginationOffsets(query);
  const where = {};

  if (query.status) where.status = query.status;
  if (query.wastePointId) where.wastePointId = query.wastePointId;
  if (query.groupId) where.groupId = query.groupId;
  if (query.search) {
    where.OR = [
      { reportCode: { contains: query.search, mode: "insensitive" } },
      { group: { groupCode: { contains: query.search, mode: "insensitive" } } },
      { wastePoint: { name: { contains: query.search, mode: "insensitive" } } },
    ];
  }

  const [items, total] = await Promise.all([
    prisma.report.findMany({
      where,
      include: {
        wastePoint: {
          select: { id: true, name: true, address: true },
        },
        group: {
          select: {
            id: true,
            groupCode: true,
            createdAt: true,
            createdBy: {
              select: { id: true, name: true, role: true },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take,
    }),
    prisma.report.count({ where }),
  ]);

  return {
    items: items.map(serializeReport),
    meta: buildPaginationMeta({ page, limit, total }),
  };
}

export async function getReportById(id) {
  const report = await prisma.report.findUnique({
    where: { id },
    include: {
      wastePoint: {
        select: {
          id: true,
          name: true,
          address: true,
          latitude: true,
          longitude: true,
          photoUrl: true,
        },
      },
      group: {
        select: {
          id: true,
          groupCode: true,
          createdAt: true,
          createdBy: {
            select: { id: true, name: true, role: true },
          },
          collectionTask: {
            select: {
              id: true,
              status: true,
              openedAt: true,
              expiresAt: true,
              completedAt: true,
              revokedAt: true,
              tpsContact: {
                select: { id: true, name: true },
              },
            },
          },
        },
      },
      photos: {
        select: { id: true, storageKey: true, createdAt: true },
        orderBy: { createdAt: "asc" },
      },
      histories: {
        select: {
          id: true,
          actorType: true,
          oldStatus: true,
          newStatus: true,
          note: true,
          createdAt: true,
          changedBy: {
            select: { id: true, name: true, role: true },
          },
        },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!report) {
    throw new NotFoundError("Laporan tidak ditemukan");
  }

  return serializeReport(report);
}
