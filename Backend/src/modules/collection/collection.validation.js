import { z } from "zod";
import { paginationFields } from "../../utils/pagination.js";

const tokenParam = z
  .string()
  .trim()
  .min(32, "Token tugas tidak valid")
  .max(128, "Token tugas tidak valid");

export const taskTokenSchema = {
  params: z.object({
    token: tokenParam,
  }),
};

export const completeTaskReportSchema = {
  params: z.object({
    token: tokenParam,
    id: z.string().uuid("Format ID laporan tidak valid"),
  }),
};

export const listOperatorTasksSchema = {
  query: z.object({
    ...paginationFields,
    status: z.enum(["ACTIVE", "COMPLETED", "EXPIRED", "REVOKED"]).optional(),
  }),
};

export const operatorTaskIdSchema = {
  params: z.object({
    id: z.string().uuid("Format ID tugas tidak valid"),
  }),
};
