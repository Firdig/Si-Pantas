import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import { env } from "./config/env.js";
import { prisma } from "./config/database.js";
import { sendSuccess, sendError } from "./utils/response.js";
import { errorHandler, notFoundHandler } from "./middlewares/errorHandler.js";

const app = express();

// Security & HTTP middlewares
app.use(helmet());
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || env.CORS_ORIGINS.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Origin tidak diizinkan oleh kebijakan CORS"));
    },
    credentials: true,
  })
);
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

if (env.NODE_ENV !== "test") {
  app.use(morgan(env.IS_PRODUCTION ? "combined" : "dev"));
}

// Health check endpoint
app.get("/health", async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return sendSuccess(res, {
      message: "Si Pantas Backend sehat",
      data: {
        status: "ok",
        database: "connected",
        uptime: Math.floor(process.uptime()),
        timestamp: new Date().toISOString(),
      },
    });
  } catch {
    return sendError(res, {
      statusCode: 503,
      message: "Koneksi database bermasalah",
      code: "DATABASE_UNAVAILABLE",
    });
  }
});

// API v1 placeholder router (akan diisi pada Fase 2 & Fase 3)
app.get("/api/v1", (_req, res) => {
  return sendSuccess(res, {
    message: "Si Pantas API v1 siap digunakan",
    data: { version: "1.0.0" },
  });
});

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
