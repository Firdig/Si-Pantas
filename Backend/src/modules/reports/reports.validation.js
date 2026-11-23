import { z } from "zod";
import { paginationFields } from "../../utils/pagination.js";

const reportItemSchema = z.object({
  wastePointId: z.string().uuid("Format ID titik sampah tidak valid"),
  category: z.string().trim().max(80).nullable().optional(),
  description: z.string().trim().max(1000).nullable().optional(),
  photoKeys: z.array(z.string().trim().min(1).max(500)).max(5).optional(),
});

export const createReportGroupSchema = {
  body: z
    .object({
      tpsContactId: z.string().uuid("Format ID kontak TPS tidak valid").optional(),
      items: z
        .array(reportItemSchema)
        .min(1, "Minimal satu titik sampah harus dipilih")
        .max(50, "Maksimal 50 titik sampah per pengiriman"),
    })
    .superRefine((data, ctx) => {
      const seen = new Set();
      data.items.forEach((item, index) => {
        if (seen.has(item.wastePointId)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["items", index, "wastePointId"],
            message: "Titik sampah tidak boleh duplikat dalam satu pengiriman",
          });
        }
        seen.add(item.wastePointId);
      });
    }),
};

export const listReportsSchema = {
  query: z.object({
    ...paginationFields,
    status: z.enum(["PENDING", "IN_PROGRESS", "COMPLETED"]).optional(),
    wastePointId: z.string().uuid().optional(),
    groupId: z.string().uuid().optional(),
    search: z.string().trim().max(120).optional(),
  }),
};

export const reportDetailSchema = {
  params: z.object({
    id: z.string().uuid("Format ID laporan tidak valid"),
  }),
};
