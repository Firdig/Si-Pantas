import crypto from "node:crypto";

function hashToken(rawToken) {
  return crypto.createHash("sha256").update(rawToken).digest("hex");
}

export async function seedCollectionTasks(prisma) {
  const group = await prisma.reportGroup.findUnique({
    where: { groupCode: "GRP-SEED-001" },
  });

  if (!group) {
    throw new Error(
      "GRP-SEED-001 belum tersedia. Jalankan seeder Report terlebih dahulu.",
    );
  }

  const tpsContact = await prisma.tpsContact.findFirst({
    where: { isActive: true },
    orderBy: { createdAt: "asc" },
  });

  if (!tpsContact) {
    throw new Error(
      "Belum ada TpsContact aktif yang tersedia untuk membuat CollectionTask.",
    );
  }

  const rawToken = "sipantas-seed-collection-task-token";
  const expiresAt = new Date(
    Date.now() + 24 * 60 * 60 * 1000,
  );

  await prisma.collectionTask.upsert({
    where: { groupId: group.id },
    update: {
      tpsContactId: tpsContact.id,
      tokenHash: hashToken(rawToken),
      status: "ACTIVE",
      openedAt: null,
      expiresAt,
      completedAt: null,
      revokedAt: null,
    },
    create: {
      groupId: group.id,
      tpsContactId: tpsContact.id,
      tokenHash: hashToken(rawToken),
      status: "ACTIVE",
      expiresAt,
    },
  });

  console.log(
    "[Seed] 1 tugas pengumpulan siap ditanamkan.",
  );
}
