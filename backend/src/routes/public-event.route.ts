import { Router } from "express";
import { publicEventController } from "../controllers/public-event.controller";

const router = Router();

router.get("/", publicEventController.getAll);
router.get("/:cuid", publicEventController.getById);

export default router;