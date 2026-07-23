import { Router } from "express";
import { changePasswordSchema, loginSchema } from "../validation/auth.validator";
import { validate } from "../middlewares/validate.middleware";
import * as AuthController from "../controllers/auth.controller"
import { authenticate } from "../middlewares/authenticate.middleware";
import { authorize } from "../middlewares/authorize.middleware";
import { Role } from "@prisma/client";

const router = Router();

router.post("/login", validate(loginSchema), AuthController.login);
router.get("/me", authenticate,AuthController.me);
router.post("/refresh", AuthController.refresh);
router.post("/logout",AuthController.logout);
router.post("/logout-all", AuthController.logoutAll);
router.post("/change-password", authenticate, validate(changePasswordSchema), AuthController.changePassword);


export default router;