import { Router } from "express";
import * as activityLogsController from "./activity-logs.controller.js";
import { listActivityLogsSchema } from "./activity-logs.validation.js";
import { validate } from "../../middlewares/validate.js";

const router = Router();
router.get("/", validate(listActivityLogsSchema), activityLogsController.list);

export default router;
