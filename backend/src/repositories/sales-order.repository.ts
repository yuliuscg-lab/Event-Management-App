import { Prisma, SalesOrderStatus } from "@prisma/client";
import { DB } from "../types/database.types";

export class SalesOrderRepository {
    async findById(db:DB, id:string) {
        return db.salesOrder.findUnique({
            where: {
                id,
            },
            include: {
                customer: true,
                event:true,
                ticketType:true,
                coupon: true,
                payment: true,
            },
        });
    }

    async findByInvoiceNumber(db:DB, invoiceNumber:string) {
        return db.salesOrder.findUnique({
            where: {
                invoiceNumber
            },
        });
    }

    async findByCustomer(db:DB, customerId:string) {
        return db.salesOrder.findMany({
            where: {
                customerId,
            },
            include: {
                event:true,
                payment: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    }

    async create(db:DB, data: Prisma.SalesOrderCreateInput) {
        return db.salesOrder.create({
            data,
        });
    }

    async update(db:DB, id:string, data: Prisma.SalesOrderUpdateInput) {
        return db.salesOrder.update({
            where: { id },
            data,
        });
    }

    async updateStatus(db:DB, id:string, status: SalesOrderStatus) {
        return db.salesOrder.update({
            where: { id },
            data: {
                status,
            },
        });
    }

    async delete(db:DB, id:string) {
        return db.salesOrder.delete({
            where: { id },
        });
    }
}

export const salesOrderRepository = new SalesOrderRepository();