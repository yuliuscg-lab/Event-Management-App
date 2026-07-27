import { Prisma } from "@prisma/client";
import { DB } from "../types/database.types";

export class CouponRepository {
    
    async findCouponByCustomerId(db:DB, customerId:string) {
        return db.coupon.findMany({
            where: { customerId, deletedAt:null },
            orderBy: { createdAt: "desc" },
        });
    }

    async findById(db:DB, id:number) {
        return db.coupon.findUnique({
            where: { id }
        })
    }

    async findByCouponCode(db:DB, code:string) {
        return db.coupon.findUnique({
            where: { couponCode: code }
        });
    }

    async create (db: DB, data: Prisma.CouponCreateInput) {
        return db.coupon.create({
            data,
        });
    }

    async update(db:DB, id: number, data: Prisma.CouponUpdateInput) {
        return db.coupon.update({
            where: { id },
            data,
        });
    }

    async reserve(db:DB, id:number, salesOrderId:string) {
        const result = await db.coupon.updateMany({
            where:{
                id,
                isUsed: false,
            },
            data:{
                isUsed: true,
                usedInOrderId: salesOrderId,
                usedAt: new Date(),
            },
        });

        return result.count;
    }

    async release(db:DB, id:number, salesOrderId:string) {
        const result = await db.coupon.updateMany({
            where: {
                id,
                usedInOrderId: salesOrderId,
            },
            data: {
                isUsed: false,
                usedInOrderId: null,
                usedAt: null,
            },
        });

        return result.count;
    }

    async delete(db:DB, id: number) {
        return db.coupon.delete({
            where: { id },
        });
    }
}

export const couponRepository = new CouponRepository();