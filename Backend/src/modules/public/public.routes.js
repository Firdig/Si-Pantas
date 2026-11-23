import { Router } from "express";
import * as publicController from "./public.controller.js";
import {
  publicEducationBySlugSchema,
  publicEducationListSchema,
  publicReportByCodeSchema,
  publicReportsListSchema,
  publicWastePointDetailSchema,
  publicWastePointsListSchema,
} from "./public.validation.js";
import { validate } from "../../middlewares/validate.js";
import { publicRateLimiter } from "../../middlewares/rateLimiter.js";

const router = Router();

router.use(publicRateLimiter);

router.get("/waste-points", validate(publicWastePointsListSchema), publicController.listWastePoints);
router.get("/waste-points/:id", validate(publicWastePointDetailSchema), publicController.getWastePoint);
router.get("/reports", validate(publicReportsListSchema), publicController.listReports);
router.get("/reports/:code", validate(publicReportByCodeSchema), publicController.getReportByCode);
router.get("/education", validate(publicEducationListSchema), publicController.listEducation);
router.get("/education/:slug", validate(publicEducationBySlugSchema), publicController.getEducationBySlug);

export default router;
