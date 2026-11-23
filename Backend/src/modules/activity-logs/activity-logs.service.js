import { prisma } from "../../config/database.js";
import { buildPaginationMeta, getPaginationOffsets } from "../../utils/pagination.js";

export async function listActivityLogs(query) {
  const { page, limit, skip, take } = getPaginationOffsets(query);
  const where = {};

  if (query.actorType) where.actorType = query.actorType;
  if (query.action) where.action = { contains: query.action, mode: "insensitive" };
  if (query.entityType) where.entityType = { equals: query.entityType, mode: "insensitive" };

  const [items, total] = await Promise.all([
    prisma.activityLog.findMany({
      where,
      select: {
        id: true,
        actorType: true,
        action: true,
        entityType: true,
        entityId: true,
        createdAt: true,
        user: {
          select: { id: true, name: true, username: true, role: true },
        },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take,
    }),
    prisma.activityLog.count({ where }),
  ]);

  return {
    items,
    meta: buildPaginationMeta({ page, limit, total }),
  };
}
