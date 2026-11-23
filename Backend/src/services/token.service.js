import crypto from "crypto";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { UnauthorizedError } from "../utils/app-error.js";

export const REFRESH_COOKIE_NAME = "sipantas_refresh_token";

export function signAccessToken({ sub, role }) {
  return jwt.sign({ sub, role }, env.JWT_ACCESS_SECRET, {
    expiresIn: env.JWT_ACCESS_EXPIRES_IN,
  });
}

export function verifyAccessToken(token) {
  try {
    return jwt.verify(token, env.JWT_ACCESS_SECRET);
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      throw new UnauthorizedError("Access token telah kedaluwarsa");
    }
    throw new UnauthorizedError("Access token tidak valid");
  }
}

export function generateOpaqueToken() {
  return crypto.randomBytes(32).toString("hex");
}

export function hashToken(rawToken) {
  return crypto.createHash("sha256").update(rawToken).digest("hex");
}

export function getRefreshTokenExpiryDate() {
  return new Date(Date.now() + env.JWT_REFRESH_EXPIRES_IN_DAYS * 24 * 60 * 60 * 1000);
}

export function getTpsTaskExpiryDate() {
  return new Date(Date.now() + env.TPS_TASK_EXPIRES_HOURS * 60 * 60 * 1000);
}

function getRefreshCookieOptions() {
  return {
    httpOnly: true,
    secure: env.COOKIE_SECURE || env.IS_PRODUCTION,
    sameSite: env.COOKIE_SAME_SITE,
    path: "/api/v1/auth",
  };
}

export function setRefreshTokenCookie(res, rawToken, expiresAt) {
  res.cookie(REFRESH_COOKIE_NAME, rawToken, {
    ...getRefreshCookieOptions(),
    expires: expiresAt,
  });
}

export function clearRefreshTokenCookie(res) {
  res.clearCookie(REFRESH_COOKIE_NAME, getRefreshCookieOptions());
}
