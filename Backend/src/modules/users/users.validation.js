import { z } from "zod";
import { paginationFields } from "../../utils/pagination.js";

export const listUsersSchema = {
  query: z.object({
    ...paginationFields,
    role: z.enum(["KADER", "OPERATOR"]).optional(),
    isActive: z
      .enum(["true", "false"])
      .transform((v) => v === "true")
      .optional(),
    search: z.string().trim().max(100).optional(),
  }),
};

export const createKaderSchema = {
  body: z.object({
    name: z.string().trim().min(2, "Nama minimal 2 karakter").max(120),
    username: z
      .string()
      .trim()
      .min(3, "Username minimal 3 karakter")
      .max(60)
      .regex(/^[a-zA-Z0-9._-]+$/, "Username hanya boleh huruf, angka, titik, underscore, dan strip"),
    password: z.string().min(8, "Password minimal 8 karakter").max(200),
  }),
};

export const updateUserSchema = {
  params: z.object({
    id: z.string().uuid("Format ID pengguna tidak valid"),
  }),
  body: z
    .object({
      name: z.string().trim().min(2).max(120).optional(),
      password: z.string().min(8, "Password minimal 8 karakter").max(200).optional(),
      isActive: z.boolean().optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: "Minimal satu field harus diisi untuk pembaruan",
    }),
};
