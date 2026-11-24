export async function seedWhatsappLogs(prisma) {
  const group = await prisma.reportGroup.findUnique({
    where: { groupCode: "GRP-SEED-001" },
  });

  if (!group) {
    throw new Error(
      "GRP-SEED-001 belum tersedia. Jalankan seeder Report terlebih dahulu.",
    );
  }

  const task = await prisma.collectionTask.findUnique({
    where: { groupId: group.id },
    include: { tpsContact: true },
  });

  if (!task) {
    throw new Error(
      "Tugas pengumpulan untuk GRP-SEED-001 belum tersedia.",
    );
  }

  const existingLog = await prisma.whatsappLog.findFirst({
    where: {
      collectionTaskId: task.id,
      providerMessageId: "SEED-MOCK-001",
    },
  });

  const logData = {
    collectionTaskId: task.id,
    recipientPhone: task.tpsContact.phoneNumber,
    messageBody:
      "Notifikasi tugas pengumpulan sampah dari Si Pantas. Buka tautan tugas untuk melihat daftar titik sampah.",
    provider: "mock",
    providerMessageId: "SEED-MOCK-001",
    status: "SENT",
    errorMessage: null,
    attemptCount: 1,
    sentAt: new Date(),
  };

  if (existingLog) {
    await prisma.whatsappLog.update({
      where: { id: existingLog.id },
      data: logData,
    });
  } else {
    await prisma.whatsappLog.create({
      data: logData,
    });
  }

  console.log("[Seed] 1 log pengiriman WhatsApp siap ditanamkan.");
}
