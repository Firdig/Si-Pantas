const dummyReports = [
  {
    reportCode: "RPT-SEED-001",
    wastePointName: "TPS Merdeka",
    category: "Sampah menumpuk",
    description: "Volume sampah sudah menumpuk dan perlu segera dikumpulkan.",
    status: "PENDING",
  },
  {
    reportCode: "RPT-SEED-002",
    wastePointName: "TPS Melati",
    category: "Tempat sampah penuh",
    description: "Tempat penampungan terisi penuh pada area depan TPS.",
    status: "IN_PROGRESS",
  },
  {
    reportCode: "RPT-SEED-003",
    wastePointName: "TPS Mawar",
    category: "Sampah berserakan",
    description: "Terdapat sampah berserakan di sekitar area penampungan.",
    status: "COMPLETED",
  },
];

export async function seedReports(prisma, createdById) {
  const groupCode = "GRP-SEED-001";

  const group = await prisma.reportGroup.upsert({
    where: { groupCode },
    update: { createdById },
    create: {
      groupCode,
      createdById,
    },
  });

  for (const report of dummyReports) {
    const wastePoint = await prisma.wastePoint.findFirst({
      where: {
        name: report.wastePointName,
        isActive: true,
      },
    });

    if (!wastePoint) {
      console.warn(
        `[Seed] Lewati laporan ${report.reportCode}: titik ${report.wastePointName} tidak ditemukan atau tidak aktif.`,
      );
      continue;
    }

    await prisma.report.upsert({
      where: { reportCode: report.reportCode },
      update: {
        groupId: group.id,
        wastePointId: wastePoint.id,
        category: report.category,
        description: report.description,
        status: report.status,
      },
      create: {
        reportCode: report.reportCode,
        groupId: group.id,
        wastePointId: wastePoint.id,
        category: report.category,
        description: report.description,
        status: report.status,
      },
    });
  }

  console.log(
    `[Seed] ${dummyReports.length} laporan dummy siap ditanamkan.`,
  );
}
