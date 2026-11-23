import { prisma } from "../../config/database.js";

export async function getOperatorDashboard() {
  const [
    reportCountsRaw,
    taskCountsRaw,
    totalWastePoints,
    activeWastePoints,
    activeKaders,
    publishedEducation,
    failedWhatsappLogs,
    recentReports,
    recentActivities,
  ] = await Promise.all([
    prisma.report.groupBy({
      by: ["status"],
      _count: { _all: true },
    }),
    prisma.collectionTask.groupBy({
      by: ["status"],
      _count: { _all: true },
    }),
    prisma.wastePoint.count(),
    prisma.wastePoint.count({ where: { isActive: true } }),
    prisma.user.count({ where: { role: "KADER", isActive: true } }),
    prisma.educationContent.count({ where: { status: "PUBLISHED" } }),
    prisma.whatsappLog.count({ where: { status: "FAILED" } }),
    prisma.report.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        reportCode: true,
        status: true,
        createdAt: true,
        wastePoint: { select: { id: true, name: true } },
        group: { select: { id: true, groupCode: true } },
      },
    }),
    prisma.activityLog.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        actorType: true,
        action: true,
        entityType: true,
        entityId: true,
        createdAt: true,
        user: { select: { id: true, name: true, role: true } },
      },
    }),
  ]);

  const reportsByStatus = {
    PENDING: 0,
    IN_PROGRESS: 0,
    COMPLETED: 0,
  };
  for (const row of reportCountsRaw) {
    reportsByStatus[row.status] = row._count._all;
  }

  const tasksByStatus = {
    ACTIVE: 0,
    COMPLETED: 0,
    EXPIRED: 0,
    REVOKED: 0,
  };
  for (const row of taskCountsRaw) {
    tasksByStatus[row.status] = row._count._all;
  }

  return {
    summary: {
      reports: {
        total:
          reportsByStatus.PENDING + reportsByStatus.IN_PROGRESS + reportsByStatus.COMPLETED,
        pending: reportsByStatus.PENDING,
        inProgress: reportsByStatus.IN_PROGRESS,
        completed: reportsByStatus.COMPLETED,
      },
      collectionTasks: {
        active: tasksByStatus.ACTIVE,
        completed: tasksByStatus.COMPLETED,
        expired: tasksByStatus.EXPIRED,
        revoked: tasksByStatus.REVOKED,
      },
      wastePoints: {
        total: totalWastePoints,
        active: activeWastePoints,
      },
      activeKaders,
      publishedEducation,
      failedWhatsappLogs,
    },
    recentReports,
    recentActivities,
  };
}
