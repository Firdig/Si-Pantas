import { Router } from "express";
import * as authController from "./auth.controller.js";
import { loginSchema } from "./auth.validation.js";
import { authenticate } from "../../middlewares/authenticate.js";
import { validate } from "../../middlewares/validate.js";
import { authRateLimiter } from "../../middlewares/rateLimiter.js";

const router = Router();

router.post("/login", authRateLimiter, validate(loginSchema), authController.login);
router.post("/refresh", authController.refresh);
router.post("/logout", authController.logout);
router.get("/me", authenticate, authController.me);

export default router;
