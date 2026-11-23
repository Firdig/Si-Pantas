import { z } from "zod";

export const loginSchema = {
  body: z.object({
    username: z
      .string({ required_error: "Username wajib diisi" })
      .trim()
      .min(1, "Username wajib diisi")
      .max(100, "Username terlalu panjang"),
    password: z
      .string({ required_error: "Password wajib diisi" })
      .min(1, "Password wajib diisi")
      .max(200, "Password terlalu panjang"),
  }),
};
