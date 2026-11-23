import { Router } from "express";
import * as wastePointsController from "./waste-points.controller.js";
import {
  createWastePointSchema,
  listKaderWastePointsSchema,
  listWastePointsSchema,
  updateWastePointSchema,
} from "./waste-points.validation.js";
import { validate } from "../../middlewares/validate.js";

export const operatorWastePointsRouter = Router();
operatorWastePointsRouter.get("/", validate(listWastePointsSchema), wastePointsController.listForOperator);
operatorWastePointsRouter.post("/", validate(createWastePointSchema), wastePointsController.create);
operatorWastePointsRouter.patch("/:id", validate(updateWastePointSchema), wastePointsController.update);

export const kaderWastePointsRouter = Router();
kaderWastePointsRouter.get("/", validate(listKaderWastePointsSchema), wastePointsController.listForKader);
