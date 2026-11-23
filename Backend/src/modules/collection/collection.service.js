import { prisma } from "../../config/database.js";
import {
  generateOpaqueToken,
  getTpsTaskExpiryDate,
  hashToken,
} from "../../services/token.service.js";
import { sendCollectionTaskNotification } from "../../services/whatsapp.service.js";
import { buildPaginationMeta, getPaginationOffsets } from "../../utils/pagination.js";
import {
  BadRequestError,
  ConflictError,
  NotFoundError,
  UnauthorizedError,
} from "../../utils/app-error.js";

const STATUS_LABELS = {
  PENDING: "Dalam Antrean",
  IN_PROGRESS: "Proses Tindak Lanjut",
  COMPLETED: "Selesai",
};

function formatTaskForTps(task) {
  return {
    taskId: task.id,
    groupCode: task.group.groupCode,
    status: task.status,
    openedAt: task.openedAt,
    expiresAt: task.expiresAt,
    completedAt: task.completedAt,
    totalPoints: task.group.reports.length,
    completedPoints: task.group.reports.filter((r) => r.status === "COMPLETED").length,
    reports: task.group.reports.map((report) => ({
      id: report.id,
      reportCode: report.reportCode,
      category: report.category,
      description: report.description,
      status: report.status,
      statusLabel: STATUS_LABELS[report.status] || report.status,
      wastePoint: {
        id: report.wastePoint.id,
        name: report.wastePoint.name,
        address: report.wastePoint.address,
        latitude: report.wastePoint.latitude !== null ? Number(report.wastePoint.latitude) : null,
        longitude: report.wastePoint.longitude !== null ? Number(report.wastePoint.longitude) : null,
      },
      createdAt: report.createdAt,
      updatedAt: report.updatedAt,
    })),
  };
}

async function assertTaskAccessible(task, dbClient = prisma) {
  if (!task) {
    throw new UnauthorizedError("Tautan tugas tidak valid");
  }

  const now = new Date();

  if (task.status === "COMPLETED") {
    throw new UnauthorizedError("Tugas pengangkutan sudah selesai dan tautan tidak berlaku lagi");
  }

  if (task.status === "REVOKED" || task.revokedAt) {
    throw new UnauthorizedError("Tautan tugas sudah dicabut dan tidak dapat digunakan");
  }

  if (task.status === "EXPIRED" || task.expiresAt <= now) {
    if (task.status === "ACTIVE") {
      await dbClient.collectionTask.update({
        where: { id: task.id },
        data: { status: "EXPIRED" },
      });
    }
    throw new UnauthorizedError("Tautan tugas telah kedaluwarsa");
  }
}

const taskWithReportsInclude = {
  group: {
    select: {
      id: true,
      groupCode: true,
      reports: {
        include: {
          wastePoint: {
            select: {
              id: true,
              name: true,
              address: true,
              latitude: true,
              longitude: true,
            },
          },
        },
        orderBy: { reportCode: "asc" },
      },
    },
  },
};

/**
 * GET /collection/tasks/:token
 * Read-only: memvalidasi token dan mengembalikan daftar titik tanpa mengubah status laporan.
 */
export async function getTaskByToken(rawToken) {
  const tokenHash = hashToken(rawToken);
  const task = await prisma.collectionTask.findUnique({
    where: { tokenHash },
    include: taskWithReportsInclude,
  });

  await assertTaskAccessible(task);

  return formatTaskForTps(task);
}

/**
 * POST /collection/tasks/:token/open
 * Idempoten: pada pembukaan pertama mengubah seluruh laporan PENDING -> IN_PROGRESS.
 */
export async function openTaskByToken(rawToken) {
  const tokenHash = hashToken(rawToken);

  return prisma.$transaction(async (tx) => {
    // Row lock pada collection_tasks untuk mencegah double-transition saat request bersamaan
    const lockedRows = await tx.$queryRaw`
      SELECT id FROM collection_tasks WHERE token_hash = ${tokenHash} FOR UPDATE
    `;

    if (!lockedRows || lockedRows.length === 0) {
      throw new UnauthorizedError("Tautan tugas tidak valid");
    }

    const task = await tx.collectionTask.findUnique({
      where: { id: lockedRows[0].id },
      include: taskWithReportsInclude,
    });

    await assertTaskAccessible(task, tx);

    if (task.openedAt) {
      return {
        alreadyOpened: true,
        task: formatTaskForTps(task),
      };
    }

    const now = new Date();
    const pendingReports = task.group.reports.filter((r) => r.status === "PENDING");

    await tx.collectionTask.update({
      where: { id: task.id },
      data: { openedAt: now },
    });

    if (pendingReports.length > 0) {
      await tx.report.updateMany({
        where: {
          id: { in: pendingReports.map((r) => r.id) },
          status: "PENDING",
        },
        data: { status: "IN_PROGRESS" },
      });

      await tx.reportStatusHistory.createMany({
        data: pendingReports.map((r) => ({
          reportId: r.id,
          changedById: null,
          actorType: "TPS",
          oldStatus: "PENDING",
          newStatus: "IN_PROGRESS",
          note: "Tautan tugas pertama kali dibuka oleh TPS",
        })),
      });
    }

    await tx.activityLog.create({
      data: {
        userId: null,
        actorType: "TPS",
        action: "COLLECTION_TASK_OPEN",
        entityType: "COLLECTION_TASK",
        entityId: task.id,
      },
    });

    const refreshed = await tx.collectionTask.findUnique({
      where: { id: task.id },
      include: taskWithReportsInclude,
    });

    return {
      alreadyOpened: false,
      task: formatTaskForTps(refreshed),
    };
  });
}

/**
 * PATCH /collection/tasks/:token/reports/:id
 * Menandai satu titik sudah diangkut (COMPLETED) secara aman terhadap race condition.
 * Jika seluruh titik dalam grup selesai, otomatis menandai task COMPLETED & mencabut token.
 */
export async function completeReportByToken(rawToken, reportId) {
  const tokenHash = hashToken(rawToken);

  return prisma.$transaction(async (tx) => {
    const lockedRows = await tx.$queryRaw`
      SELECT id FROM collection_tasks WHERE token_hash = ${tokenHash} FOR UPDATE
    `;

    if (!lockedRows || lockedRows.length === 0) {
      throw new UnauthorizedError("Tautan tugas tidak valid");
    }

    const task = await tx.collectionTask.findUnique({
      where: { id: lockedRows[0].id },
    });

    await assertTaskAccessible(task, tx);

    // Validasi kepemilikan reportId terhadap groupId milik token ini
    const report = await tx.report.findFirst({
      where: {
        id: reportId,
        groupId: task.groupId,
      },
      include: {
        wastePoint: { select: { id: true, name: true, address: true } },
      },
    });

    if (!report) {
      throw new NotFoundError("Laporan tidak ditemukan dalam grup tugas ini");
    }

    if (report.status === "COMPLETED") {
      throw new ConflictError("Titik sampah ini sudah dikonfirmasi selesai diangkut");
    }

    const now = new Date();
    const oldStatus = report.status;

    const updatedReport = await tx.report.update({
      where: { id: report.id },
      data: { status: "COMPLETED" },
      include: {
        wastePoint: { select: { id: true, name: true, address: true } },
      },
    });

    await tx.reportStatusHistory.create({
      data: {
        reportId: report.id,
        changedById: null,
        actorType: "TPS",
        oldStatus,
        newStatus: "COMPLETED",
        note: "Pengangkutan dikonfirmasi selesai oleh TPS",
      },
    });

    await tx.activityLog.create({
      data: {
        userId: null,
        actorType: "TPS",
        action: "REPORT_COMPLETE_BY_TPS",
        entityType: "REPORT",
        entityId: report.id,
      },
    });

    const remainingCount = await tx.report.count({
      where: {
        groupId: task.groupId,
        status: { not: "COMPLETED" },
      },
    });

    let taskCompleted = false;
    if (remainingCount === 0) {
      taskCompleted = true;
      await tx.collectionTask.update({
        where: { id: task.id },
        data: {
          status: "COMPLETED",
          openedAt: task.openedAt ?? now,
          completedAt: now,
          revokedAt: now,
        },
      });

      await tx.activityLog.create({
        data: {
          userId: null,
          actorType: "TPS",
          action: "COLLECTION_TASK_COMPLETE",
          entityType: "COLLECTION_TASK",
          entityId: task.id,
        },
      });
    }

    return {
      report: {
        id: updatedReport.id,
        reportCode: updatedReport.reportCode,
        status: updatedReport.status,
        statusLabel: STATUS_LABELS[updatedReport.status],
        wastePoint: updatedReport.wastePoint,
        updatedAt: updatedReport.updatedAt,
      },
      remainingPoints: remainingCount,
      taskCompleted,
      taskStatus: taskCompleted ? "COMPLETED" : "ACTIVE",
    };
  });
}

// --- Operator Endpoints ---

export async function listOperatorTasks(query) {
  const { page, limit, skip, take } = getPaginationOffsets(query);
  const where = {};

  if (query.status) {
    where.status = query.status;
  }

  const [items, total] = await Promise.all([
    prisma.collectionTask.findMany({
      where,
      select: {
        id: true,
        groupId: true,
        status: true,
        openedAt: true,
        expiresAt: true,
        completedAt: true,
        revokedAt: true,
        createdAt: true,
        tpsContact: {
          select: { id: true, name: true, phoneNumber: true },
        },
        group: {
          select: {
            id: true,
            groupCode: true,
            createdAt: true,
            createdBy: { select: { id: true, name: true, role: true } },
            reports: {
              select: {
                id: true,
                reportCode: true,
                status: true,
                wastePoint: { select: { id: true, name: true } },
              },
              orderBy: { reportCode: "asc" },
            },
          },
        },
        whatsappLogs: {
          select: {
            id: true,
            status: true,
            provider: true,
            attemptCount: true,
            sentAt: true,
            errorMessage: true,
            createdAt: true,
          },
          orderBy: { createdAt: "desc" },
          take: 3,
        },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take,
    }),
    prisma.collectionTask.count({ where }),
  ]);

  return {
    items,
    meta: buildPaginationMeta({ page, limit, total }),
  };
}

/**
 * Mengirim ulang notifikasi WhatsApp untuk CollectionTask tanpa membuat grup/task duplikat.
 * Token baru di-generate dan menggantikan tokenHash lama (karena token lama tidak disimpan mentah).
 */
export async function resendWhatsappForTask(taskId, actorId) {
  const task = await prisma.collectionTask.findUnique({
    where: { id: taskId },
    include: {
      tpsContact: true,
      group: {
        include: {
          reports: {
            include: { wastePoint: { select: { name: true } } },
            orderBy: { reportCode: "asc" },
          },
        },
      },
      whatsappLogs: {
        orderBy: { attemptCount: "desc" },
        take: 1,
      },
    },
  });

  if (!task) {
    throw new NotFoundError("Tugas pengangkutan tidak ditemukan");
  }

  if (task.status === "COMPLETED") {
    throw new BadRequestError("Tugas pengangkutan sudah selesai dan tidak dapat dikirim ulang");
  }

  if (task.status === "REVOKED") {
    throw new BadRequestError("Tugas pengangkutan sudah dicabut");
  }

  if (!task.tpsContact.isActive) {
    throw new BadRequestError("Kontak TPS pada tugas ini sedang tidak aktif");
  }

  const newRawToken = generateOpaqueToken();
  const newTokenHash = hashToken(newRawToken);
  const newExpiresAt = getTpsTaskExpiryDate();
  const nextAttempt = (task.whatsappLogs[0]?.attemptCount || 0) + 1;

  await prisma.$transaction(async (tx) => {
    await tx.collectionTask.update({
      where: { id: task.id },
      data: {
        tokenHash: newTokenHash,
        status: "ACTIVE",
        expiresAt: newExpiresAt,
        revokedAt: null,
      },
    });

    await tx.activityLog.create({
      data: {
        userId: actorId,
        actorType: "OPERATOR",
        action: "COLLECTION_TASK_RESEND_WA",
        entityType: "COLLECTION_TASK",
        entityId: task.id,
      },
    });
  });

  const waResult = await sendCollectionTaskNotification({
    collectionTaskId: task.id,
    recipientPhone: task.tpsContact.phoneNumber,
    wastePointNames: task.group.reports.map((r) => r.wastePoint.name),
    rawToken: newRawToken,
    attemptCount: nextAttempt,
  });

  return {
    taskId: task.id,
    expiresAt: newExpiresAt,
    whatsappNotification: {
      id: waResult.log.id,
      status: waResult.log.status,
      attemptCount: waResult.log.attemptCount,
      sentAt: waResult.log.sentAt,
      errorMessage: waResult.log.errorMessage,
    },
  };
}

export async function revokeTaskByOperator(taskId, actorId) {
  const task = await prisma.collectionTask.findUnique({ where: { id: taskId } });
  if (!task) {
    throw new NotFoundError("Tugas pengangkutan tidak ditemukan");
  }
  if (task.status === "COMPLETED") {
    throw new BadRequestError("Tugas yang sudah selesai tidak perlu dicabut");
  }

  return prisma.$transaction(async (tx) => {
    const updated = await tx.collectionTask.update({
      where: { id: taskId },
      data: {
        status: "REVOKED",
        revokedAt: new Date(),
      },
      select: {
        id: true,
        status: true,
        revokedAt: true,
      },
    });

    await tx.activityLog.create({
      data: {
        userId: actorId,
        actorType: "OPERATOR",
        action: "COLLECTION_TASK_REVOKE",
        entityType: "COLLECTION_TASK",
        entityId: taskId,
      },
    });

    return updated;
  });
}
