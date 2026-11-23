import express, { Router } from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import { env } from "./config/env.js";
import { prisma } from "./config/database.js";
import { sendSuccess, sendError } from "./utils/response.js";
import { errorHandler, notFoundHandler } from "./middlewares/errorHandler.js";
import { authenticate } from "./middlewares/authenticate.js";
import { authorize } from "./middlewares/authorize.js";

import authRoutes from "./modules/auth/auth.routes.js";
import publicRoutes from "./modules/public/public.routes.js";
import usersRoutes from "./modules/users/users.routes.js";
import tpsContactsRoutes from "./modules/tps-contacts/tps-contacts.routes.js";
import educationRoutes from "./modules/education/education.routes.js";
import dashboardRoutes from "./modules/dashboard/dashboard.routes.js";
import activityLogsRoutes from "./modules/activity-logs/activity-logs.routes.js";
import {
  kaderWastePointsRouter,
  operatorWastePointsRouter,
} from "./modules/waste-points/waste-points.routes.js";
import { reportGroupsRouter, reportsRouter } from "./modules/reports/reports.routes.js";
import {
  operatorCollectionTasksRouter,
  tpsCollectionRouter,
} from "./modules/collection/collection.routes.js";

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

// API v1 root
app.get("/api/v1", (_req, res) => {
  return sendSuccess(res, {
    message: "Si Pantas API v1 siap digunakan",
    data: { version: "1.0.0" },
  });
});

// 1. Public API (Warga — read-only, tanpa login)
app.use("/api/v1/public", publicRoutes);

// 2. Authentication API (Kader & Operator)
app.use("/api/v1/auth", authRoutes);

// 3. Kader API (JWT + role KADER only)
const kaderRouter = Router();
kaderRouter.use(authenticate, authorize("KADER"));
kaderRouter.use("/reports", reportsRouter);
kaderRouter.use("/report-groups", reportGroupsRouter);
kaderRouter.use("/waste-points", kaderWastePointsRouter);
app.use("/api/v1/kader", kaderRouter);

// 4. Operator API (JWT + role OPERATOR only)
const operatorRouter = Router();
operatorRouter.use(authenticate, authorize("OPERATOR"));
operatorRouter.use("/dashboard", dashboardRoutes);
operatorRouter.use("/reports", reportsRouter);
operatorRouter.use("/report-groups", reportGroupsRouter);
operatorRouter.use("/waste-points", operatorWastePointsRouter);
operatorRouter.use("/education", educationRoutes);
operatorRouter.use("/users", usersRoutes);
operatorRouter.use("/collection-tasks", operatorCollectionTasksRouter);
operatorRouter.use("/tps-contacts", tpsContactsRoutes);
operatorRouter.use("/activity-logs", activityLogsRoutes);
app.use("/api/v1/operator", operatorRouter);

// 5. TPS Collection API (Token rahasia URL, tanpa JWT)
app.use("/api/v1/collection", tpsCollectionRouter);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
