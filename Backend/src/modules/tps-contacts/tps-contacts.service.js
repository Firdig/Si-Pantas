import { prisma } from "../../config/database.js";
import { buildPaginationMeta, getPaginationOffsets } from "../../utils/pagination.js";
import { ConflictError, NotFoundError } from "../../utils/app-error.js";

export async function listTpsContacts(query) {
  const { page, limit, skip, take } = getPaginationOffsets(query);
  const where = {};

  if (typeof query.isActive === "boolean") {
    where.isActive = query.isActive;
  }

  const [items, total] = await Promise.all([
    prisma.tpsContact.findMany({
      where,
      orderBy: { createdAt: "asc" },
      skip,
      take,
    }),
    prisma.tpsContact.count({ where }),
  ]);

  return {
    items,
    meta: buildPaginationMeta({ page, limit, total }),
  };
}

export async function createTpsContact(data, actorId) {
  const existing = await prisma.tpsContact.findUnique({
    where: { phoneNumber: data.phoneNumber },
  });
  if (existing) {
    throw new ConflictError("Nomor WhatsApp TPS sudah terdaftar");
  }

  return prisma.$transaction(async (tx) => {
    const created = await tx.tpsContact.create({
      data: {
        name: data.name,
        phoneNumber: data.phoneNumber,
        isActive: data.isActive ?? true,
      },
    });

    await tx.activityLog.create({
      data: {
        userId: actorId,
        actorType: "OPERATOR",
        action: "TPS_CONTACT_CREATE",
        entityType: "TPS_CONTACT",
        entityId: created.id,
      },
    });

    return created;
  });
}

export async function updateTpsContact(id, data, actorId) {
  const existing = await prisma.tpsContact.findUnique({ where: { id } });
  if (!existing) {
    throw new NotFoundError("Kontak TPS tidak ditemukan");
  }

  if (data.phoneNumber && data.phoneNumber !== existing.phoneNumber) {
    const duplicate = await prisma.tpsContact.findUnique({
      where: { phoneNumber: data.phoneNumber },
    });
    if (duplicate) {
      throw new ConflictError("Nomor WhatsApp TPS sudah digunakan kontak lain");
    }
  }

  return prisma.$transaction(async (tx) => {
    const updated = await tx.tpsContact.update({
      where: { id },
      data,
    });

    await tx.activityLog.create({
      data: {
        userId: actorId,
        actorType: "OPERATOR",
        action: "TPS_CONTACT_UPDATE",
        entityType: "TPS_CONTACT",
        entityId: updated.id,
      },
    });

    return updated;
  });
}
