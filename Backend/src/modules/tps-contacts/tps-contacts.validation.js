import { z } from "zod";
import { paginationFields } from "../../utils/pagination.js";

const phoneSchema = z
  .string()
  .trim()
  .min(8, "Nomor WhatsApp minimal 8 digit")
  .max(25, "Nomor WhatsApp terlalu panjang")
  .regex(/^\+?[0-9]+$/, "Nomor WhatsApp hanya boleh berisi angka dan opsional awalan +");

export const listTpsContactsSchema = {
  query: z.object({
    ...paginationFields,
    isActive: z
      .enum(["true", "false"])
      .transform((v) => v === "true")
      .optional(),
  }),
};

export const createTpsContactSchema = {
  body: z.object({
    name: z.string().trim().min(2, "Nama TPS minimal 2 karakter").max(120),
    phoneNumber: phoneSchema,
    isActive: z.boolean().optional().default(true),
  }),
};

export const updateTpsContactSchema = {
  params: z.object({
    id: z.string().uuid("Format ID kontak TPS tidak valid"),
  }),
  body: z
    .object({
      name: z.string().trim().min(2).max(120).optional(),
      phoneNumber: phoneSchema.optional(),
      isActive: z.boolean().optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: "Minimal satu field harus diisi untuk pembaruan",
    }),
};
