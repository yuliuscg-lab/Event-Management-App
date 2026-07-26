import { Request, Response } from "express";
import { couponService } from "../services/coupon.service";
import { success } from "../utils/response";

class CouponController {
    async getMyCoupons(req: Request, res: Response) {
        const coupons = await couponService.getMyCoupons(req.userId!);

        return success(
            res,
            200,
            "Coupons retrieved successfully",
            coupons
        );
    }
}

export const couponController = new CouponController();