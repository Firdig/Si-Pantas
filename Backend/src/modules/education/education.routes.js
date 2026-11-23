import { Router } from "express";
import * as educationController from "./education.controller.js";
import {
  createEducationSchema,
  listEducationSchema,
  updateEducationSchema,
} from "./education.validation.js";
import { validate } from "../../middlewares/validate.js";

const router = Router();

router.get("/", validate(listEducationSchema), educationController.list);
router.post("/", validate(createEducationSchema), educationController.create);
router.patch("/:id", validate(updateEducationSchema), educationController.update);

export default router;
