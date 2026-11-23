import { z } from "zod";
import { paginationFields } from "../../utils/pagination.js";

const slugSchema = z
  .string()
  .trim()
  .min(2)
  .max(180)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug hanya boleh huruf kecil, angka, dan tanda hubung (-)");

export const listEducationSchema = {
  query: z.object({
    ...paginationFields,
    status: z.enum(["DRAFT", "PUBLISHED"]).optional(),
    category: z.string().trim().max(80).optional(),
    search: z.string().trim().max(120).optional(),
  }),
};

export const createEducationSchema = {
  body: z.object({
    title: z.string().trim().min(3, "Judul minimal 3 karakter").max(200),
    slug: slugSchema.optional(),
    content: z.string().trim().min(10, "Isi konten minimal 10 karakter"),
    category: z.string().trim().max(80).nullable().optional(),
    imageUrl: z.string().trim().url("URL gambar tidak valid").max(500).nullable().optional(),
    status: z.enum(["DRAFT", "PUBLISHED"]).optional().default("DRAFT"),
  }),
};

export const updateEducationSchema = {
  params: z.object({
    id: z.string().uuid("Format ID konten edukasi tidak valid"),
  }),
  body: z
    .object({
      title: z.string().trim().min(3).max(200).optional(),
      slug: slugSchema.optional(),
      content: z.string().trim().min(10).optional(),
      category: z.string().trim().max(80).nullable().optional(),
      imageUrl: z.string().trim().url("URL gambar tidak valid").max(500).nullable().optional(),
      status: z.enum(["DRAFT", "PUBLISHED"]).optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: "Minimal satu field harus diisi untuk pembaruan",
    }),
};
