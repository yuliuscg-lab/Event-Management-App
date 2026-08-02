import { prisma } from "../config/prisma";
import { PaidOrderRow, PaidOrderWithCategoryRow } from "../types/dashboard.types";

export class DashboardRepository {
    async sumRevenue(gte: Date, lt?:Date): Promise<number> {
        const result = await prisma.salesOrder.aggregate({
            where: {
                status:"PAID",
                createdAt: {
                    gte,
                    ...(lt? {lt}:{})
                }
            },
            _sum: {
                finalPrice:true
            },
        });

        return result._sum.finalPrice ?? 0;
    }

    async sumTicketsSold(gte:Date, lt?:Date):Promise<number> {
        const result = await prisma.salesOrder.aggregate({
            where: {
                status:"PAID",
                createdAt:{
                    gte,
                    ...(lt? {lt}:{})  
                }
            },
            _sum: {
                qtyTickets:true,
            }
        });

        return result._sum.qtyTickets ?? 0;
    }

    async countPublishedEvents(createdBefore?:Date):Promise<number> {
        return prisma.event.count({
            where: {
                status: "PUBLISHED",
                ...(createdBefore?{createdAt: { lt: createdBefore }}:{}),
            },
        });
    }

    async findPaidOrdersSince(gte:Date):Promise<PaidOrderRow[]> {
        return prisma.salesOrder.findMany({
            where: { 
                status:"PAID" , 
                createdAt: { gte },
            },
            select: {
                createdAt:true,
                finalPrice:true
            },
        });
    }

    async findPaidOrdersWithCategorySince(gte:Date):Promise<PaidOrderWithCategoryRow[]> {
        return prisma.salesOrder.findMany({
            where: {
                status:"PAID",
                createdAt: {gte},
            },
            select: {
                finalPrice:true,
                event: {
                    select: {
                        category:{
                            select:{
                                category:true
                            },
                        },
                    },
                },
            },
        });
    }
}

export const dashboardRepository = new DashboardRepository();