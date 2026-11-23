import { ZodError } from "zod";
import { env } from "../config/env.js";
import { AppError } from "../utils/app-error.js";
import { sendError } from "../utils/response.js";

export function notFoundHandler(req, res) {
  return sendError(res, {
    statusCode: 404,
    message: `Endpoint ${req.method} ${req.originalUrl} tidak ditemukan`,
    code: "ROUTE_NOT_FOUND",
  });
}

export function errorHandler(err, _req, res, _next) {
  if (err instanceof AppError) {
    return sendError(res, {
      statusCode: err.statusCode,
      message: err.message,
      code: err.code,
      details: err.details,
    });
  }

  if (err instanceof ZodError) {
    const details = err.issues.map((issue) => ({
      path: issue.path.join("."),
      message: issue.message,
    }));

    return sendError(res, {
      statusCode: 400,
      message: "Validasi input gagal",
      code: "VALIDATION_ERROR",
      details,
    });
  }

  // Prisma known request errors
  if (err?.code === "P2002") {
    return sendError(res, {
      statusCode: 409,
      message: "Data duplikat sudah terdaftar",
      code: "DUPLICATE_ENTRY",
    });
  }

  if (err?.code === "P2025") {
    return sendError(res, {
      statusCode: 404,
      message: "Data yang diminta tidak ditemukan",
      code: "NOT_FOUND",
    });
  }

  if (err?.code === "P2003") {
    return sendError(res, {
      statusCode: 400,
      message: "Relasi data tidak valid",
      code: "FOREIGN_KEY_CONSTRAINT",
    });
  }

  // Invalid JSON body from express.json()
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return sendError(res, {
      statusCode: 400,
      message: "Format JSON pada body tidak valid",
      code: "INVALID_JSON",
    });
  }

  console.error("[UnhandledError]", env.IS_PRODUCTION ? err.message : err);

  return sendError(res, {
    statusCode: 500,
    message: "Terjadi kesalahan internal pada server",
    code: "INTERNAL_ERROR",
  });
}
