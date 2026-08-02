import { Router } from "express";
import { dashboardController } from "../controllers/dashboard.controller";
import { authenticate } from "../middlewares/authenticate.middleware";
import { authorize } from "../middlewares/authorize.middleware";
import { Role } from "@prisma/client";

const router = Router();

router.use(authenticate);
router.get("/stats-card-data", authorize(Role.ORGANIZER, Role.ADMIN), dashboardController.getStats);
router.get("/sales-chart-data", authorize(Role.ORGANIZER, Role.ADMIN), dashboardController.getSalesChart);
router.get("/revenue-stream-data", authorize(Role.ORGANIZER, Role.ADMIN), dashboardController.getRevenueStream);

export default router;
