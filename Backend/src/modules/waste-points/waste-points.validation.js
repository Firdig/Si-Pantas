import { z } from "zod";
import { paginationFields } from "../../utils/pagination.js";

const coordinateSchema = (min, max, label) =>
  z.coerce
    .number()
    .min(min, `${label} minimal ${min}`)
    .max(max, `${label} maksimal ${max}`)
    .nullable()
    .optional();

export const listWastePointsSchema = {
  query: z.object({
    ...paginationFields,
    isActive: z
      .enum(["true", "false"])
      .transform((v) => v === "true")
      .optional(),
    search: z.string().trim().max(120).optional(),
  }),
};

export const listKaderWastePointsSchema = {
  query: z.object({
    ...paginationFields,
    search: z.string().trim().max(120).optional(),
  }),
};

export const createWastePointSchema = {
  body: z.object({
    name: z.string().trim().min(2, "Nama titik sampah minimal 2 karakter").max(150),
    address: z.string().trim().min(3, "Alamat minimal 3 karakter").max(500),
    latitude: coordinateSchema(-90, 90, "Latitude"),
    longitude: coordinateSchema(-180, 180, "Longitude"),
    photoUrl: z.string().trim().url("URL foto tidak valid").max(500).nullable().optional(),
    isActive: z.boolean().optional().default(true),
  }),
};

export const updateWastePointSchema = {
  params: z.object({
    id: z.string().uuid("Format ID titik sampah tidak valid"),
  }),
  body: z
    .object({
      name: z.string().trim().min(2).max(150).optional(),
      address: z.string().trim().min(3).max(500).optional(),
      latitude: coordinateSchema(-90, 90, "Latitude"),
      longitude: coordinateSchema(-180, 180, "Longitude"),
      photoUrl: z.string().trim().url("URL foto tidak valid").max(500).nullable().optional(),
      isActive: z.boolean().optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: "Minimal satu field harus diisi untuk pembaruan",
    }),
};
