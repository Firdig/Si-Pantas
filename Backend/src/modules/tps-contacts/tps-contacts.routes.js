import { Router } from "express";
import * as tpsContactsController from "./tps-contacts.controller.js";
import {
  createTpsContactSchema,
  listTpsContactsSchema,
  updateTpsContactSchema,
} from "./tps-contacts.validation.js";
import { validate } from "../../middlewares/validate.js";

const router = Router();

router.get("/", validate(listTpsContactsSchema), tpsContactsController.list);
router.post("/", validate(createTpsContactSchema), tpsContactsController.create);
router.patch("/:id", validate(updateTpsContactSchema), tpsContactsController.update);

export default router;
