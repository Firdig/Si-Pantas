import { prisma } from "../config/database.js";
import { verifyAccessToken } from "../services/token.service.js";
import { UnauthorizedError } from "../utils/app-error.js";

export async function authenticate(req, _res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new UnauthorizedError("Header Authorization Bearer diperlukan");
    }

    const token = authHeader.slice(7).trim();
    if (!token) {
      throw new UnauthorizedError("Access token tidak ditemukan");
    }

    const payload = verifyAccessToken(token);
    if (!payload?.sub) {
      throw new UnauthorizedError("Payload token tidak valid");
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      select: {
        id: true,
        name: true,
        username: true,
        role: true,
        isActive: true,
      },
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedError("Akun tidak ditemukan atau sudah dinonaktifkan");
    }

    req.user = {
      id: user.id,
      name: user.name,
      username: user.username,
      role: user.role,
    };

    return next();
  } catch (error) {
    return next(error);
  }
}
