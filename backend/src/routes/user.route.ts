import { Router } from "express";
import { Role } from "@prisma/client";
import { authenticate } from "../middlewares/authenticate.middleware";
import { authorize } from "../middlewares/authorize.middleware";
import { validate } from "../middlewares/validate.middleware";
import { updateUserSchema } from "../validation/user.validator";
import * as userController from "../controllers/user.controller";

const router = Router();

router.get("/", authenticate, authorize(Role.ADMIN), userController.findAll);
router.get("/:cuid", authenticate, userController.findById);
router.patch("/:cuid", authenticate, validate(updateUserSchema), userController.update);
router.delete("/:cuid", authenticate, userController.remove);

export default router;