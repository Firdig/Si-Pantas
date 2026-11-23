import { z } from "zod";
import { paginationFields } from "../../utils/pagination.js";

export const listActivityLogsSchema = {
  query: z.object({
    ...paginationFields,
    actorType: z.enum(["KADER", "OPERATOR", "TPS", "SYSTEM"]).optional(),
    action: z.string().trim().max(100).optional(),
    entityType: z.string().trim().max(100).optional(),
  }),
};
