import { Router } from "express";
import * as usersController from "./users.controller.js";
import { createKaderSchema, listUsersSchema, updateUserSchema } from "./users.validation.js";
import { validate } from "../../middlewares/validate.js";

const router = Router();

router.get("/", validate(listUsersSchema), usersController.list);
router.post("/", validate(createKaderSchema), usersController.create);
router.patch("/:id", validate(updateUserSchema), usersController.update);

export default router;
