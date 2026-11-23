import bcrypt from "bcrypt";
import { prisma } from "../../config/database.js";
import { buildPaginationMeta, getPaginationOffsets } from "../../utils/pagination.js";
import { BadRequestError, ConflictError, NotFoundError } from "../../utils/app-error.js";

const userSelect = {
  id: true,
  name: true,
  username: true,
  role: true,
  isActive: true,
  createdAt: true,
  updatedAt: true,
};

export async function listUsers(query) {
  const { page, limit, skip, take } = getPaginationOffsets(query);
  const where = {};

  if (query.role) where.role = query.role;
  if (typeof query.isActive === "boolean") where.isActive = query.isActive;
  if (query.search) {
    where.OR = [
      { name: { contains: query.search, mode: "insensitive" } },
      { username: { contains: query.search, mode: "insensitive" } },
    ];
  }

  const [items, total] = await Promise.all([
    prisma.user.findMany({
      where,
      select: userSelect,
      orderBy: { createdAt: "desc" },
      skip,
      take,
    }),
    prisma.user.count({ where }),
  ]);

  return {
    items,
    meta: buildPaginationMeta({ page, limit, total }),
  };
}

export async function createKader({ name, username, password }, actorId) {
  const existing = await prisma.user.findUnique({ where: { username } });
  if (existing) {
    throw new ConflictError("Username sudah digunakan");
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const user = await prisma.$transaction(async (tx) => {
    const created = await tx.user.create({
      data: {
        name,
        username,
        passwordHash,
        role: "KADER",
        isActive: true,
      },
      select: userSelect,
    });

    await tx.activityLog.create({
      data: {
        userId: actorId,
        actorType: "OPERATOR",
        action: "USER_CREATE_KADER",
        entityType: "USER",
        entityId: created.id,
      },
    });

    return created;
  });

  return user;
}

export async function updateUser(id, data, actorId) {
  const target = await prisma.user.findUnique({ where: { id } });
  if (!target) {
    throw new NotFoundError("Pengguna tidak ditemukan");
  }

  if (target.id === actorId && data.isActive === false) {
    throw new BadRequestError("Operator tidak dapat menonaktifkan akunnya sendiri");
  }

  const updateData = {};
  if (data.name !== undefined) updateData.name = data.name;
  if (data.isActive !== undefined) updateData.isActive = data.isActive;
  if (data.password !== undefined) {
    updateData.passwordHash = await bcrypt.hash(data.password, 12);
  }

  const updated = await prisma.$transaction(async (tx) => {
    const saved = await tx.user.update({
      where: { id },
      data: updateData,
      select: userSelect,
    });

    // Jika akun dinonaktifkan, cabut seluruh refresh token aktifnya
    if (data.isActive === false) {
      await tx.refreshToken.updateMany({
        where: { userId: id, revokedAt: null },
        data: { revokedAt: new Date() },
      });
    }

    await tx.activityLog.create({
      data: {
        userId: actorId,
        actorType: "OPERATOR",
        action: "USER_UPDATE",
        entityType: "USER",
        entityId: saved.id,
      },
    });

    return saved;
  });

  return updated;
}
