import { Router } from "express";
import { categoryController } from "../controllers/category.controller";
import { authenticate } from "../middlewares/authenticate";
import { authorize } from "../middlewares/authorize";
import { Role } from "@prisma/client";

const router = Router();

router.get("/", categoryController.getAll.bind(categoryController));
router.get("/:id", categoryController.getById.bind(categoryController));
router.post("/", authenticate, authorize(Role.ADMIN),categoryController.create.bind(categoryController));
router.patch("/:id", authenticate, authorize(Role.ADMIN), categoryController.update.bind(categoryController));
router.delete("/:id", authenticate, authorize(Role.ADMIN), categoryController.delete.bind(categoryController));

export default router;