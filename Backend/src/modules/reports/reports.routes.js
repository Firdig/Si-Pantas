import { Router } from "express";
import * as reportsController from "./reports.controller.js";
import {
  createReportGroupSchema,
  listReportsSchema,
  reportDetailSchema,
} from "./reports.validation.js";
import { validate } from "../../middlewares/validate.js";

export const reportsRouter = Router();
reportsRouter.get("/", validate(listReportsSchema), reportsController.list);
reportsRouter.get("/:id", validate(reportDetailSchema), reportsController.detail);

export const reportGroupsRouter = Router();
reportGroupsRouter.post("/", validate(createReportGroupSchema), reportsController.createGroup);
