import { Router } from "express";
import { categoryController } from "../controllers/category.controller";
import { authenticate } from "../middlewares/authenticate.middleware";
import { authorize } from "../middlewares/authorize.middleware";
import { Role } from "@prisma/client";
import { validate } from "../middlewares/validate.middleware";
import { createCategorySchema, updateCategorySchema } from "../validation/category.validator";

const router = Router();

router.get("/", categoryController.getAll.bind(categoryController));
router.get("/:id", categoryController.getById.bind(categoryController));
router.post("/", authenticate, authorize(Role.ADMIN), validate(createCategorySchema),categoryController.create.bind(categoryController));
router.patch("/:id", authenticate, authorize(Role.ADMIN), validate(updateCategorySchema), categoryController.update.bind(categoryController));
router.delete("/:id", authenticate, authorize(Role.ADMIN), categoryController.delete.bind(categoryController));

export default router;