import bcrypt from "bcrypt";
import { prisma } from "../../config/database.js";
import {
  generateOpaqueToken,
  getRefreshTokenExpiryDate,
  hashToken,
  signAccessToken,
} from "../../services/token.service.js";
import { UnauthorizedError } from "../../utils/app-error.js";

function toAuthUserDto(user) {
  return {
    id: user.id,
    name: user.name,
    username: user.username,
    role: user.role,
  };
}

export async function login({ username, password }) {
  const user = await prisma.user.findUnique({
    where: { username },
  });

  if (!user) {
    throw new UnauthorizedError("Username atau password salah");
  }

  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
  if (!isPasswordValid) {
    throw new UnauthorizedError("Username atau password salah");
  }

  if (!user.isActive) {
    throw new UnauthorizedError("Akun Anda sedang dinonaktifkan. Hubungi Operator.");
  }

  const accessToken = signAccessToken({ sub: user.id, role: user.role });
  const rawRefreshToken = generateOpaqueToken();
  const tokenHash = hashToken(rawRefreshToken);
  const refreshTokenExpiresAt = getRefreshTokenExpiryDate();

  await prisma.$transaction([
    prisma.refreshToken.create({
      data: {
        userId: user.id,
        tokenHash,
        expiresAt: refreshTokenExpiresAt,
      },
    }),
    prisma.activityLog.create({
      data: {
        userId: user.id,
        actorType: user.role,
        action: "AUTH_LOGIN",
        entityType: "USER",
        entityId: user.id,
      },
    }),
  ]);

  return {
    accessToken,
    refreshToken: rawRefreshToken,
    refreshTokenExpiresAt,
    user: toAuthUserDto(user),
  };
}

export async function refresh(rawRefreshToken) {
  if (!rawRefreshToken) {
    throw new UnauthorizedError("Refresh token tidak ditemukan");
  }

  const tokenHash = hashToken(rawRefreshToken);
  const existingToken = await prisma.refreshToken.findUnique({
    where: { tokenHash },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          username: true,
          role: true,
          isActive: true,
        },
      },
    },
  });

  if (!existingToken) {
    throw new UnauthorizedError("Refresh token tidak valid");
  }

  const now = new Date();

  // Deteksi penggunaan ulang token yang sudah dicabut: cabut semua sesi aktif user tersebut
  if (existingToken.revokedAt) {
    await prisma.refreshToken.updateMany({
      where: {
        userId: existingToken.userId,
        revokedAt: null,
      },
      data: { revokedAt: now },
    });
    throw new UnauthorizedError("Sesi tidak valid terdeteksi. Silakan login kembali.");
  }

  if (existingToken.expiresAt <= now) {
    await prisma.refreshToken.update({
      where: { id: existingToken.id },
      data: { revokedAt: now },
    });
    throw new UnauthorizedError("Sesi telah kedaluwarsa. Silakan login kembali.");
  }

  if (!existingToken.user.isActive) {
    await prisma.refreshToken.updateMany({
      where: {
        userId: existingToken.userId,
        revokedAt: null,
      },
      data: { revokedAt: now },
    });
    throw new UnauthorizedError("Akun Anda sedang dinonaktifkan");
  }

  const newRawRefreshToken = generateOpaqueToken();
  const newTokenHash = hashToken(newRawRefreshToken);
  const newExpiresAt = getRefreshTokenExpiryDate();

  await prisma.$transaction([
    prisma.refreshToken.update({
      where: { id: existingToken.id },
      data: { revokedAt: now },
    }),
    prisma.refreshToken.create({
      data: {
        userId: existingToken.user.id,
        tokenHash: newTokenHash,
        expiresAt: newExpiresAt,
      },
    }),
  ]);

  const accessToken = signAccessToken({
    sub: existingToken.user.id,
    role: existingToken.user.role,
  });

  return {
    accessToken,
    refreshToken: newRawRefreshToken,
    refreshTokenExpiresAt: newExpiresAt,
    user: toAuthUserDto(existingToken.user),
  };
}

export async function logout(rawRefreshToken) {
  if (!rawRefreshToken) {
    return;
  }

  const tokenHash = hashToken(rawRefreshToken);
  const existingToken = await prisma.refreshToken.findUnique({
    where: { tokenHash },
    include: {
      user: {
        select: { id: true, role: true },
      },
    },
  });

  if (!existingToken || existingToken.revokedAt) {
    return;
  }

  await prisma.$transaction([
    prisma.refreshToken.update({
      where: { id: existingToken.id },
      data: { revokedAt: new Date() },
    }),
    prisma.activityLog.create({
      data: {
        userId: existingToken.user.id,
        actorType: existingToken.user.role,
        action: "AUTH_LOGOUT",
        entityType: "USER",
        entityId: existingToken.user.id,
      },
    }),
  ]);
}
