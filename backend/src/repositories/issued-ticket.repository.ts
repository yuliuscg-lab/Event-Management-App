import { Prisma } from "@prisma/client";
import { DB } from "../types/database.types";
import { prisma } from "../config/prisma";

export class IssuedTicketRepository {

    async findTicketByCustomerId(customerId:string) {
        return prisma.issuedTicket.findMany({
            where: { 
                salesOrder: { customerId },
            },
            include: {
                salesOrder:true,
                ticketType:true,
            },
            orderBy: {
                createdAt:"desc",
            }
        });
    }

    async findBySalesOrderId(db:DB, salesOrderId:string) {
        return db.issuedTicket.findMany({
            where: { salesOrderId },
        });
    }

    async findByTicketCode(db: DB, ticketCode:string) {
        return db.issuedTicket.findUnique({
            where: { ticketCode },
        });
    }

    async createMany(db: DB, data:Prisma.IssuedTicketCreateManyInput[]) {
        return db.issuedTicket.createMany({
            data,
        });
    }

    async markAsUsed(db: DB, id:string) {
        return db.issuedTicket.update({
            where: { id },
            data: {
                isUsed: true,
                usedAt: new Date(),
            },
        });
    }
}

export const issuedTicketRepository = new IssuedTicketRepository();