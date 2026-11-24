import "dotenv/config";
import pg from "pg";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { seedEducationContents } from "./seeds/educationContents.js";
import { seedUsers } from "./seeds/users.js";
import { seedTpsContacts } from "./seeds/tpsContacts.js";
import { seedWastePoints } from "./seeds/wastePoints.js";
import { seedReports } from "./seeds/reports.js";
import { seedCollectionTasks } from "./seeds/collectionTasks.js";
import { seedWhatsappLogs } from "./seeds/whatsappLogs.js";
import { seedReportStatusHistories } from "./seeds/reportStatusHistories.js";
import { seedReportPhotos } from "./seeds/reportPhotos.js";

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const { operator, kader } = await seedUsers(prisma);
  await seedTpsContacts(prisma);
  await seedWastePoints(prisma);
  await seedEducationContents(prisma, operator.id);
  await seedReports(prisma, kader.id);
  await seedCollectionTasks(prisma);
  await seedWhatsappLogs(prisma);
  await seedReportStatusHistories(prisma, kader.id);
  await seedReportPhotos(prisma);
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
