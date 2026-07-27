import { PaymentStatus, Prisma } from "@prisma/client";
import { DB } from "../types/database.types";

export class PaymentRepository {
    async findById(db:DB, id:string) {
        return db.payment.findUnique({
            where: { id },
            include: {
                salesOrder:true,
            },
        });
    }

    async findBySalesOrderId(db:DB, salesOrderId:string) {
        return db.payment.findUnique({
            where: { salesOrderId },
        });
    }

    async create(db:DB, data: Prisma.PaymentCreateInput) {
        return db.payment.create({
            data,
        });
    }

    async update(db:DB, id:string, data: Prisma.PaymentUpdateInput) {
        return db.payment.update({
            where: { id },
            data,
        });
    }

    async updateStatus(db:DB, id:string, status: PaymentStatus) {
        return db.payment.update({
            where: { id },
            data: {
                status,
            },
        });
    }

    async findExpiredWaitingUpload(db:DB) {
        return db.payment.findMany({
            where: {
                status: PaymentStatus.WAITING_UPLOAD,
                expiredAt: {
                    lt: new Date(),
                },
            },
            include: {
                salesOrder: true,
            },
        });
    }

    async delete(db:DB, id:string) {
        return db.payment.delete({
            where: { id },
        });
    }
}

export const paymentRepository = new PaymentRepository();
