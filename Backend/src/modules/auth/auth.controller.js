import * as authService from "./auth.service.js";
import {
  clearRefreshTokenCookie,
  REFRESH_COOKIE_NAME,
  setRefreshTokenCookie,
} from "../../services/token.service.js";
import { sendSuccess } from "../../utils/response.js";

export async function login(req, res) {
  const { accessToken, refreshToken, refreshTokenExpiresAt, user } = await authService.login(req.body);

  setRefreshTokenCookie(res, refreshToken, refreshTokenExpiresAt);

  return sendSuccess(res, {
    statusCode: 200,
    message: "Login berhasil",
    data: {
      accessToken,
      user,
    },
  });
}

export async function refresh(req, res) {
  const rawRefreshToken = req.cookies?.[REFRESH_COOKIE_NAME];

  try {
    const { accessToken, refreshToken, refreshTokenExpiresAt, user } = await authService.refresh(rawRefreshToken);

    setRefreshTokenCookie(res, refreshToken, refreshTokenExpiresAt);

    return sendSuccess(res, {
      statusCode: 200,
      message: "Access token berhasil diperbarui",
      data: {
        accessToken,
        user,
      },
    });
  } catch (error) {
    clearRefreshTokenCookie(res);
    throw error;
  }
}

export async function logout(req, res) {
  const rawRefreshToken = req.cookies?.[REFRESH_COOKIE_NAME];

  await authService.logout(rawRefreshToken);
  clearRefreshTokenCookie(res);

  return sendSuccess(res, {
    statusCode: 200,
    message: "Logout berhasil",
    data: null,
  });
}

export async function me(req, res) {
  return sendSuccess(res, {
    statusCode: 200,
    message: "Data sesi pengguna berhasil diambil",
    data: {
      user: req.user,
    },
  });
}
