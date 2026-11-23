import "dotenv/config";
import bcrypt from "bcrypt";
import pg from "pg";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const name = process.env.SEED_OPERATOR_NAME || "Operator Si Pantas";
  const username = process.env.SEED_OPERATOR_USERNAME || "operator";
  const password = process.env.SEED_OPERATOR_PASSWORD;

  if (!password) {
    throw new Error("SEED_OPERATOR_PASSWORD wajib diisi di .env sebelum menjalankan seed");
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const operator = await prisma.user.upsert({
    where: { username },
    update: {
      name,
      isActive: true,
    },
    create: {
      name,
      username,
      passwordHash,
      role: "OPERATOR",
      isActive: true,
    },
    select: {
      id: true,
      name: true,
      username: true,
      role: true,
      isActive: true,
    },
  });

  console.log("[Seed] Akun Operator siap:", operator);
}

main()
  .catch((error) => {
    console.error("[Seed] Gagal menjalankan seed:", error.message);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
