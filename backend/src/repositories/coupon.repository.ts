import { Prisma } from "@prisma/client";
import { DB } from "../types/database.types";

export class CouponRepository {
    
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

    async markAsUsed(db:DB, id:number) {
        return db.coupon.update({
            where: { id },
            data: {
                isUsed: true,
            },
        });
    }

    async delete(db:DB, id: number) {
        return db.coupon.delete({
            where: { id },
        });
    }
}

export const couponRepository = new CouponRepository();