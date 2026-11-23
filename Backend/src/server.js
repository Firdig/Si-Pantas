import app from "./app.js";
import { env } from "./config/env.js";
import { disconnectDatabase, prisma } from "./config/database.js";

let server;

async function startServer() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    console.log("[Database] Koneksi PostgreSQL berhasil.");

    server = app.listen(env.PORT, () => {
      console.log(`[Server] Si Pantas Backend berjalan di http://localhost:${env.PORT} (${env.NODE_ENV})`);
    });
  } catch (error) {
    console.error("[Startup] Gagal memulai server:", error.message);
    await disconnectDatabase().catch(() => {});
    process.exit(1);
  }
}

async function shutdown(signal) {
  console.log(`\n[Shutdown] Menerima sinyal ${signal}. Menutup server...`);
  if (server) {
    server.close(async () => {
      await disconnectDatabase();
      console.log("[Shutdown] Server dan koneksi database ditutup dengan aman.");
      process.exit(0);
    });
  } else {
    await disconnectDatabase();
    process.exit(0);
  }
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

startServer();
