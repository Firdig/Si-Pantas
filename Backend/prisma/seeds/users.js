import bcrypt from "bcrypt";

export async function seedUsers(prisma) {
  const operatorPassword = process.env.SEED_OPERATOR_PASSWORD;

  if (!operatorPassword) {
    throw new Error(
      "SEED_OPERATOR_PASSWORD wajib diisi di .env sebelum menjalankan seed",
    );
  }

  const operatorPasswordHash = await bcrypt.hash(operatorPassword, 12);
  const operator = await prisma.user.upsert({
    where: {
      username: process.env.SEED_OPERATOR_USERNAME || "operator",
    },
    update: {
      name: process.env.SEED_OPERATOR_NAME || "Operator Si Pantas",
      passwordHash: operatorPasswordHash,
      role: "OPERATOR",
      isActive: true,
    },
    create: {
      name: process.env.SEED_OPERATOR_NAME || "Operator Si Pantas",
      username: process.env.SEED_OPERATOR_USERNAME || "operator",
      passwordHash: operatorPasswordHash,
      role: "OPERATOR",
      isActive: true,
    },
  });

  const kaderPassword =
    process.env.SEED_KADER_PASSWORD || "ChangeMe123!";
  const kaderPasswordHash = await bcrypt.hash(kaderPassword, 12);
  const kader = await prisma.user.upsert({
    where: {
      username: process.env.SEED_KADER_USERNAME || "kader",
    },
    update: {
      name: process.env.SEED_KADER_NAME || "Kader Si Pantas",
      passwordHash: kaderPasswordHash,
      role: "KADER",
      isActive: true,
    },
    create: {
      name: process.env.SEED_KADER_NAME || "Kader Si Pantas",
      username: process.env.SEED_KADER_USERNAME || "kader",
      passwordHash: kaderPasswordHash,
      role: "KADER",
      isActive: true,
    },
  });

  console.log("[Seed] Akun Operator siap:", {
    id: operator.id,
    name: operator.name,
    username: operator.username,
    role: operator.role,
    isActive: operator.isActive,
  });
  console.log("[Seed] Akun Kader siap:", {
    id: kader.id,
    name: kader.name,
    username: kader.username,
    role: kader.role,
    isActive: kader.isActive,
  });

  return { operator, kader };
}
