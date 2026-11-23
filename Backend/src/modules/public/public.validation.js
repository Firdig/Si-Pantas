import { z } from "zod";
import { paginationFields } from "../../utils/pagination.js";

export const publicWastePointsListSchema = {
  query: z.object({
    ...paginationFields,
    search: z.string().trim().max(120).optional(),
  }),
};

export const publicWastePointDetailSchema = {
  params: z.object({
    id: z.string().uuid("Format ID titik sampah tidak valid"),
  }),
};

export const publicReportsListSchema = {
  query: z.object({
    ...paginationFields,
    status: z.enum(["PENDING", "IN_PROGRESS", "COMPLETED"]).optional(),
    wastePointId: z.string().uuid().optional(),
    search: z.string().trim().max(120).optional(),
  }),
};

export const publicReportByCodeSchema = {
  params: z.object({
    code: z.string().trim().min(3, "Kode laporan tidak valid").max(50),
  }),
};

export const publicEducationListSchema = {
  query: z.object({
    ...paginationFields,
    category: z.string().trim().max(80).optional(),
    search: z.string().trim().max(120).optional(),
  }),
};

export const publicEducationBySlugSchema = {
  params: z.object({
    slug: z.string().trim().min(2).max(180),
  }),
};
