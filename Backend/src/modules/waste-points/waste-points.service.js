import { prisma } from "../../config/database.js";
import { buildPaginationMeta, getPaginationOffsets } from "../../utils/pagination.js";
import { NotFoundError } from "../../utils/app-error.js";

function serializeWastePoint(point) {
  return {
    ...point,
    latitude: point.latitude !== null ? Number(point.latitude) : null,
    longitude: point.longitude !== null ? Number(point.longitude) : null,
  };
}

export async function listWastePoints(query, { onlyActive = false } = {}) {
  const { page, limit, skip, take } = getPaginationOffsets(query);
  const where = {};

  if (onlyActive) {
    where.isActive = true;
  } else if (typeof query.isActive === "boolean") {
    where.isActive = query.isActive;
  }

  if (query.search) {
    where.OR = [
      { name: { contains: query.search, mode: "insensitive" } },
      { address: { contains: query.search, mode: "insensitive" } },
    ];
  }

  const [items, total] = await Promise.all([
    prisma.wastePoint.findMany({
      where,
      orderBy: { name: "asc" },
      skip,
      take,
    }),
    prisma.wastePoint.count({ where }),
  ]);

  return {
    items: items.map(serializeWastePoint),
    meta: buildPaginationMeta({ page, limit, total }),
  };
}

export async function createWastePoint(data, actorId) {
  const created = await prisma.$transaction(async (tx) => {
    const point = await tx.wastePoint.create({
      data: {
        name: data.name,
        address: data.address,
        latitude: data.latitude ?? null,
        longitude: data.longitude ?? null,
        photoUrl: data.photoUrl ?? null,
        isActive: data.isActive ?? true,
      },
    });

    await tx.activityLog.create({
      data: {
        userId: actorId,
        actorType: "OPERATOR",
        action: "WASTE_POINT_CREATE",
        entityType: "WASTE_POINT",
        entityId: point.id,
      },
    });

    return point;
  });

  return serializeWastePoint(created);
}

export async function updateWastePoint(id, data, actorId) {
  const existing = await prisma.wastePoint.findUnique({ where: { id } });
  if (!existing) {
    throw new NotFoundError("Titik sampah tidak ditemukan");
  }

  const updated = await prisma.$transaction(async (tx) => {
    const point = await tx.wastePoint.update({
      where: { id },
      data,
    });

    await tx.activityLog.create({
      data: {
        userId: actorId,
        actorType: "OPERATOR",
        action: "WASTE_POINT_UPDATE",
        entityType: "WASTE_POINT",
        entityId: point.id,
      },
    });

    return point;
  });

  return serializeWastePoint(updated);
}
