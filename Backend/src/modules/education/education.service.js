import { prisma } from "../../config/database.js";
import { buildPaginationMeta, getPaginationOffsets } from "../../utils/pagination.js";
import { ConflictError, NotFoundError } from "../../utils/app-error.js";

function toSlug(title) {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 150);
}

async function resolveUniqueSlug(baseSlug, excludeId = null) {
  let candidate = baseSlug || "edukasi";
  let suffix = 1;

  while (true) {
    const existing = await prisma.educationContent.findUnique({
      where: { slug: candidate },
      select: { id: true },
    });

    if (!existing || existing.id === excludeId) {
      return candidate;
    }

    suffix += 1;
    candidate = `${baseSlug}-${suffix}`;
  }
}

export async function listEducation(query) {
  const { page, limit, skip, take } = getPaginationOffsets(query);
  const where = {};

  if (query.status) where.status = query.status;
  if (query.category) where.category = { equals: query.category, mode: "insensitive" };
  if (query.search) {
    where.OR = [
      { title: { contains: query.search, mode: "insensitive" } },
      { content: { contains: query.search, mode: "insensitive" } },
    ];
  }

  const [items, total] = await Promise.all([
    prisma.educationContent.findMany({
      where,
      include: {
        createdBy: {
          select: { id: true, name: true, username: true },
        },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take,
    }),
    prisma.educationContent.count({ where }),
  ]);

  return {
    items,
    meta: buildPaginationMeta({ page, limit, total }),
  };
}

export async function createEducation(data, actorId) {
  let slug;
  if (data.slug) {
    const dup = await prisma.educationContent.findUnique({ where: { slug: data.slug } });
    if (dup) throw new ConflictError("Slug konten edukasi sudah digunakan");
    slug = data.slug;
  } else {
    slug = await resolveUniqueSlug(toSlug(data.title));
  }

  return prisma.$transaction(async (tx) => {
    const created = await tx.educationContent.create({
      data: {
        createdById: actorId,
        title: data.title,
        slug,
        content: data.content,
        category: data.category ?? null,
        imageUrl: data.imageUrl ?? null,
        status: data.status ?? "DRAFT",
      },
    });

    await tx.activityLog.create({
      data: {
        userId: actorId,
        actorType: "OPERATOR",
        action: "EDUCATION_CREATE",
        entityType: "EDUCATION_CONTENT",
        entityId: created.id,
      },
    });

    return created;
  });
}

export async function updateEducation(id, data, actorId) {
  const existing = await prisma.educationContent.findUnique({ where: { id } });
  if (!existing) {
    throw new NotFoundError("Konten edukasi tidak ditemukan");
  }

  if (data.slug && data.slug !== existing.slug) {
    const dup = await prisma.educationContent.findUnique({ where: { slug: data.slug } });
    if (dup) throw new ConflictError("Slug konten edukasi sudah digunakan");
  }

  return prisma.$transaction(async (tx) => {
    const updated = await tx.educationContent.update({
      where: { id },
      data,
    });

    await tx.activityLog.create({
      data: {
        userId: actorId,
        actorType: "OPERATOR",
        action: "EDUCATION_UPDATE",
        entityType: "EDUCATION_CONTENT",
        entityId: updated.id,
      },
    });

    return updated;
  });
}
