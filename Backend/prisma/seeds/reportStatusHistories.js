const seededHistories = {
  "RPT-SEED-001": [
    {
      oldStatus: null,
      newStatus: "PENDING",
      actorType: "KADER",
      note: "Laporan dibuat",
    },
  ],
  "RPT-SEED-002": [
    {
      oldStatus: null,
      newStatus: "PENDING",
      actorType: "KADER",
      note: "Laporan dibuat",
    },
    {
      oldStatus: "PENDING",
      newStatus: "IN_PROGRESS",
      actorType: "TPS",
      note: "Tautan tugas pertama kali dibuka oleh TPS",
    },
  ],
  "RPT-SEED-003": [
    {
      oldStatus: null,
      newStatus: "PENDING",
      actorType: "KADER",
      note: "Laporan dibuat",
    },
    {
      oldStatus: "PENDING",
      newStatus: "IN_PROGRESS",
      actorType: "TPS",
      note: "Tautan tugas pertama kali dibuka oleh TPS",
    },
    {
      oldStatus: "IN_PROGRESS",
      newStatus: "COMPLETED",
      actorType: "TPS",
      note: "Pengangkutan dikonfirmasi selesai oleh TPS",
    },
  ],
};

export async function seedReportStatusHistories(prisma, kaderId) {
  for (const [reportCode, histories] of Object.entries(seededHistories)) {
    const report = await prisma.report.findUnique({
      where: { reportCode },
    });

    if (!report) {
      console.warn(
        `[Seed] Lewati riwayat status: laporan ${reportCode} tidak ditemukan.`,
      );
      continue;
    }

    await prisma.reportStatusHistory.deleteMany({
      where: {
        reportId: report.id,
        note: {
          in: [
            "Laporan dibuat",
            "Tautan tugas pertama kali dibuka oleh TPS",
            "Pengangkutan dikonfirmasi selesai oleh TPS",
          ],
        },
      },
    });

    await prisma.reportStatusHistory.createMany({
      data: histories.map((history) => ({
        reportId: report.id,
        changedById: history.actorType === "KADER" ? kaderId : null,
        actorType: history.actorType,
        oldStatus: history.oldStatus,
        newStatus: history.newStatus,
        note: history.note,
      })),
    });
  }

  console.log(
    `[Seed] Riwayat status untuk ${Object.keys(seededHistories).length} laporan siap ditanamkan.`,
  );
}
