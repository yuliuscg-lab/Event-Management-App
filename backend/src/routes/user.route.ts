import { Router } from "express";
import * as UserController from "../controllers/user.controller"
import { createUserSchema, updateUserSchema } from "../validation/user.validator";
import { validate } from "../middlewares/validate.middleware";


const router = Router();

router.get("/", UserController.findAll);
router.post("/", validate(createUserSchema), UserController.create);
router.get("/:id", UserController.findById);
router.patch("/:id", validate(updateUserSchema), UserController.update);

export default router;
