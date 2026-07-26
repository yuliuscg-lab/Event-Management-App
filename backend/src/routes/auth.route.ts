import { Router } from "express";
import { authenticate } from "../middlewares/authenticate.middleware";
import { validate } from "../middlewares/validate.middleware";
import { registerSchema, loginSchema, changePasswordSchema } from "../validation/auth.validator";
import * as authController from "../controllers/auth.controller";

const router = Router();

router.post("/register", validate(registerSchema), authController.register);
router.post("/login", validate(loginSchema), authController.login);
router.post("/refresh", authController.refresh);
router.get("/me", authenticate, authController.me);
router.post("/logout", authController.logout);
router.post("/logout-all", authenticate, authController.logoutAll);
router.patch("/change-password", authenticate, validate(changePasswordSchema), authController.changePassword);

export default router;