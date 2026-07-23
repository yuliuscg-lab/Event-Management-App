import { Coupon, Prisma } from "@prisma/client";
import { couponRepository } from "../repositories/coupon.repository";
import { prisma } from "../config/prisma";
import { AppError } from "../errors/AppError";

export class CouponService {

    async validateCoupon(
        customerId:string,
        couponCode:string,
        subtotal:number
    ):Promise<{coupon: Coupon, discountAmount:number}> {
        const coupon = await couponRepository.findByCouponCode(
            prisma, couponCode,
        );

        if (!coupon) {
            throw new AppError("Kupon tidak ditemukan!", 404);
        }

        if(coupon.customerId !== customerId) {
            throw new AppError("Kupon bukan milik Customer!", 403);
        }

        if(coupon.expiredAt < new Date()) {
            throw new AppError("Kupon sudah expired!", 400);
        }

        if(coupon.isUsed) {
            throw new AppError("Kupon sudah digunakan!", 400);
        }

        return {
            coupon,
            discountAmount: Math.floor(subtotal * (coupon.discountPercent / 100)),
        };
    }

    async consumeCoupon(
        tx: Prisma.TransactionClient,
        couponId:number,
    ):Promise<void> {
        const coupon = await couponRepository.findById(tx, couponId);
        
        if(!coupon) {
            throw new AppError("Kupon tidak ditemukan!", 404);
        }

        if(coupon.isUsed) {
            throw new AppError("Kupon sudah digunakan!", 400);
        }

        await couponRepository.markAsUsed(tx, couponId);
    }
}

export const couponService = new CouponService();