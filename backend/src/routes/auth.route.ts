import { Router } from "express";
import { changePasswordSchema, loginSchema } from "../validation/auth.validator";
import { validate } from "../middlewares/validate";
import * as AuthController from "../controllers/auth.controller"
import { authenticate } from "../middlewares/authenticate";
import { authorize } from "../middlewares/authorize";
import { Role } from "@prisma/client";

const router = Router();

router.post("/login", validate(loginSchema), AuthController.login);
router.get("/me", authenticate,AuthController.me);
router.post("/refresh", AuthController.refresh);
router.post("/logout",AuthController.logout);
router.post("/logout-all", AuthController.logoutAll);
router.post("/change-password", authenticate, validate(changePasswordSchema), AuthController.changePassword);

router.get(
    "/organizer",
    authenticate,
    authorize(Role.ORGANIZER),
    (_, res) => {
        res.json({
            message: "Welcome Organizer",
        });
    }
);

router.get(
    "/admin",
    authenticate,
    authorize(Role.ADMIN),
    (_, res) => {
        res.json({
            message: "Welcome Admin",
        });
    }
);

router.get(
    "/dashboard",
    authenticate,
    authorize(
        Role.ADMIN,
        Role.ORGANIZER
    ),
    (_, res) => {
        res.json({
            message: "Dashboard",
        });
    }
);


export default router;