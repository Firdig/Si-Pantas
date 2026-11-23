import { prisma } from "../../config/database.js";
import { buildPaginationMeta, getPaginationOffsets } from "../../utils/pagination.js";
import { NotFoundError } from "../../utils/app-error.js";
import {
  toPublicEducationDetailDto,
  toPublicEducationSummaryDto,
  toPublicReportDetailDto,
  toPublicReportSummaryDto,
  toPublicWastePointDto,
} from "./public.dto.js";

export async function listPublicWastePoints(query) {
  const { page, limit, skip, take } = getPaginationOffsets(query);
  const where = { isActive: true };

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
    items: items.map(toPublicWastePointDto),
    meta: buildPaginationMeta({ page, limit, total }),
  };
}

export async function getPublicWastePointById(id) {
  const point = await prisma.wastePoint.findFirst({
    where: { id, isActive: true },
  });

  if (!point) {
    throw new NotFoundError("Titik sampah tidak ditemukan");
  }

  return toPublicWastePointDto(point);
}

export async function listPublicReports(query) {
  const { page, limit, skip, take } = getPaginationOffsets(query);
  const where = {};

  if (query.status) where.status = query.status;
  if (query.wastePointId) where.wastePointId = query.wastePointId;
  if (query.search) {
    where.OR = [
      { reportCode: { contains: query.search, mode: "insensitive" } },
      { wastePoint: { name: { contains: query.search, mode: "insensitive" } } },
    ];
  }

  const [items, total] = await Promise.all([
    prisma.report.findMany({
      where,
      select: {
        reportCode: true,
        category: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        wastePoint: {
          select: {
            id: true,
            name: true,
            address: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take,
    }),
    prisma.report.count({ where }),
  ]);

  return {
    items: items.map(toPublicReportSummaryDto),
    meta: buildPaginationMeta({ page, limit, total }),
  };
}

export async function getPublicReportByCode(code) {
  const report = await prisma.report.findUnique({
    where: { reportCode: code },
    select: {
      reportCode: true,
      category: true,
      description: true,
      status: true,
      createdAt: true,
      updatedAt: true,
      wastePoint: {
        select: {
          id: true,
          name: true,
          address: true,
          latitude: true,
          longitude: true,
          photoUrl: true,
        },
      },
      photos: {
        select: {
          id: true,
          storageKey: true,
          createdAt: true,
        },
        orderBy: { createdAt: "asc" },
      },
      histories: {
        select: {
          oldStatus: true,
          newStatus: true,
          note: true,
          createdAt: true,
        },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!report) {
    throw new NotFoundError("Laporan tidak ditemukan");
  }

  return toPublicReportDetailDto(report);
}

export async function listPublicEducation(query) {
  const { page, limit, skip, take } = getPaginationOffsets(query);
  const where = { status: "PUBLISHED" };

  if (query.category) {
    where.category = { equals: query.category, mode: "insensitive" };
  }
  if (query.search) {
    where.OR = [
      { title: { contains: query.search, mode: "insensitive" } },
      { content: { contains: query.search, mode: "insensitive" } },
    ];
  }

  const [items, total] = await Promise.all([
    prisma.educationContent.findMany({
      where,
      select: {
        id: true,
        title: true,
        slug: true,
        category: true,
        imageUrl: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: "desc" },
      skip,
      take,
    }),
    prisma.educationContent.count({ where }),
  ]);

  return {
    items: items.map(toPublicEducationSummaryDto),
    meta: buildPaginationMeta({ page, limit, total }),
  };
}

export async function getPublicEducationBySlug(slug) {
  const item = await prisma.educationContent.findFirst({
    where: { slug, status: "PUBLISHED" },
    select: {
      id: true,
      title: true,
      slug: true,
      content: true,
      category: true,
      imageUrl: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!item) {
    throw new NotFoundError("Konten edukasi tidak ditemukan");
  }

  return toPublicEducationDetailDto(item);
}
