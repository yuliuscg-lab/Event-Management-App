import { Router } from "express";
import * as UserController from "../controllers/user.controller"
import { createUserSchema } from "../validation/user.validator";
import { validate } from "../middlewares/validate";


const router = Router();

router.get("/", UserController.findAll);

export default router;
