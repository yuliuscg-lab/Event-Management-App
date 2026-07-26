import { Router } from "express";
import { pointController } from "../controllers/point.controller";
import { authenticate } from "../middlewares/authenticate.middleware";

const router = Router();

router.get("/my", authenticate, pointController.getMyPoints.bind(pointController));

export default router;