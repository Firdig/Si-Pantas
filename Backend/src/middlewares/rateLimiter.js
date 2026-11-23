import rateLimit from "express-rate-limit";
import { sendError } from "../utils/response.js";

function createRateLimiter({ windowMs, limit, message }) {
  return rateLimit({
    windowMs,
    limit,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    handler: (_req, res) => {
      return sendError(res, {
        statusCode: 429,
        message,
        code: "TOO_MANY_REQUESTS",
      });
    },
  });
}

export const authRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  limit: 15,
  message: "Terlalu banyak percobaan login. Silakan coba lagi dalam 15 menit.",
});

export const publicRateLimiter = createRateLimiter({
  windowMs: 1 * 60 * 1000,
  limit: 120,
  message: "Terlalu banyak permintaan. Silakan coba beberapa saat lagi.",
});

export const tpsRateLimiter = createRateLimiter({
  windowMs: 1 * 60 * 1000,
  limit: 60,
  message: "Terlalu banyak permintaan pada tautan tugas. Silakan coba beberapa saat lagi.",
});
