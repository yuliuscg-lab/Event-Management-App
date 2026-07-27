import { Router } from "express";
import { couponController } from "../controllers/coupon.controller";
import { authenticate } from "../middlewares/authenticate.middleware";

const router = Router();

router.get("/my", authenticate, couponController.getMyCoupons.bind(couponController));

export default router;