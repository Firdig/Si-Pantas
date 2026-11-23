import { Router } from "express";
import * as collectionController from "./collection.controller.js";
import {
  completeTaskReportSchema,
  listOperatorTasksSchema,
  operatorTaskIdSchema,
  taskTokenSchema,
} from "./collection.validation.js";
import { validate } from "../../middlewares/validate.js";
import { tpsRateLimiter } from "../../middlewares/rateLimiter.js";

export const tpsCollectionRouter = Router();
tpsCollectionRouter.use(tpsRateLimiter);
tpsCollectionRouter.get("/tasks/:token", validate(taskTokenSchema), collectionController.getTask);
tpsCollectionRouter.post("/tasks/:token/open", validate(taskTokenSchema), collectionController.openTask);
tpsCollectionRouter.patch(
  "/tasks/:token/reports/:id",
  validate(completeTaskReportSchema),
  collectionController.completeReport
);

export const operatorCollectionTasksRouter = Router();
operatorCollectionTasksRouter.get(
  "/",
  validate(listOperatorTasksSchema),
  collectionController.listOperatorTasks
);
operatorCollectionTasksRouter.post(
  "/:id/resend-whatsapp",
  validate(operatorTaskIdSchema),
  collectionController.resendWhatsapp
);
operatorCollectionTasksRouter.post(
  "/:id/revoke",
  validate(operatorTaskIdSchema),
  collectionController.revokeTask
);
