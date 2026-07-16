import { Router } from "express";
import { loginSchema } from "../validation/auth.validator";
import { validate } from "../middlewares/validate";
import * as AuthController from "../controllers/auth.controller"
import { authenticate } from "../middlewares/authenticate";

const router = Router();

router.post("/login", validate(loginSchema), AuthController.login);
router.get("/me", authenticate,AuthController.me);
export default router;