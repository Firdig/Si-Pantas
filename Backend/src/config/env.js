import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(5000),
  DATABASE_URL: z.string().min(1, "DATABASE_URL wajib diisi"),

  CORS_ORIGIN: z.string().default("http://localhost:3000"),
  FRONTEND_URL: z.string().url().default("http://localhost:3000"),

  JWT_ACCESS_SECRET: z.string().min(16, "JWT_ACCESS_SECRET minimal 16 karakter"),
  JWT_REFRESH_SECRET: z.string().min(16, "JWT_REFRESH_SECRET minimal 16 karakter"),
  JWT_ACCESS_EXPIRES_IN: z.string().default("15m"),
  JWT_REFRESH_EXPIRES_IN_DAYS: z.coerce.number().int().positive().default(7),

  COOKIE_SECURE: z
    .enum(["true", "false"])
    .default("false")
    .transform((val) => val === "true"),
  COOKIE_SAME_SITE: z.enum(["lax", "strict", "none"]).default("lax"),

  TPS_TASK_EXPIRES_HOURS: z.coerce.number().int().positive().default(48),

  WHATSAPP_PROVIDER: z.string().default("mock"),
  WHATSAPP_API_KEY: z.string().optional().default(""),
  WHATSAPP_API_URL: z.string().optional().default(""),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("Konfigurasi environment variable tidak valid:");
  console.error(parsed.error.flatten().fieldErrors);
  process.exit(1);
}

const corsOrigins = parsed.data.CORS_ORIGIN.split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

export const env = {
  ...parsed.data,
  CORS_ORIGINS: corsOrigins,
  IS_PRODUCTION: parsed.data.NODE_ENV === "production",
};
