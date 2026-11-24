const seededPhotos = {
  "RPT-SEED-001": [
    "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b",
  ],
  "RPT-SEED-002": [
    "https://images.unsplash.com/photo-1604187351574-c75ca79f5807",
  ],
  "RPT-SEED-003": [
    "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09",
  ],
};

export async function seedReportPhotos(prisma) {
  let seededCount = 0;

  for (const [reportCode, storageKeys] of Object.entries(seededPhotos)) {
    const report = await prisma.report.findUnique({
      where: { reportCode },
    });

    if (!report) {
      console.warn(
        `[Seed] Lewati foto: laporan ${reportCode} tidak ditemukan.`,
      );
      continue;
    }

    for (const storageKey of storageKeys) {
      const existing = await prisma.reportPhoto.findFirst({
        where: {
          reportId: report.id,
          storageKey,
        },
      });

      if (!existing) {
        await prisma.reportPhoto.create({
          data: {
            reportId: report.id,
            storageKey,
          },
        });
        seededCount += 1;
      }
    }
  }

  console.log(
    `[Seed] ${seededCount} foto laporan dummy dipastikan tersedia.`,
  );
}
