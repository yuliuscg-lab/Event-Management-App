import { prisma } from "../config/prisma";
import { PaidOrderRow, PaidOrderWithCategoryRow } from "../types/dashboard.types";
import { Role } from "@prisma/client";

export class DashboardRepository {
    async sumRevenue(gte: Date, lt?: Date, organizerId?: string, role?: Role): Promise<number> {
        const result = await prisma.salesOrder.aggregate({
            where: {
                status: "PAID",
                createdAt: {
                    gte,
                    ...(lt ? { lt } : {})
                },
                ...(role !== Role.ADMIN && organizerId ? {
                    event: {
                        organizerId
                    }
                } : {})
            },
            _sum: {
                finalPrice: true
            },
        });

        return result._sum.finalPrice ?? 0;
    }

    async sumTicketsSold(gte: Date, lt?: Date, organizerId?: string, role?: Role): Promise<number> {
        const result = await prisma.salesOrder.aggregate({
            where: {
                status: "PAID",
                createdAt: {
                    gte,
                    ...(lt ? { lt } : {})  
                },
                ...(role !== Role.ADMIN && organizerId ? {
                    event: {
                        organizerId
                    }
                } : {})
            },
            _sum: {
                qtyTickets: true,
            }
        });

        return result._sum.qtyTickets ?? 0;
    }

    async countPublishedEvents(createdBefore?: Date, organizerId?: string, role?: Role): Promise<number> {
        return prisma.event.count({
            where: {
                status: "PUBLISHED",
                ...(createdBefore ? { createdAt: { lt: createdBefore } } : {}),
                ...(role !== Role.ADMIN && organizerId ? { organizerId } : {}),
            },
        });
    }

    async findPaidOrdersSince(gte: Date, organizerId?: string, role?: Role): Promise<PaidOrderRow[]> {
        return prisma.salesOrder.findMany({
            where: { 
                status: "PAID", 
                createdAt: { gte },
                ...(role !== Role.ADMIN && organizerId ? {
                    event: {
                        organizerId
                    }
                } : {})
            },
            select: {
                createdAt: true,
                finalPrice: true
            },
        });
    }

    async findPaidOrdersWithCategorySince(gte: Date, organizerId?: string, role?: Role): Promise<PaidOrderWithCategoryRow[]> {
        return prisma.salesOrder.findMany({
            where: {
                status: "PAID",
                createdAt: { gte },
                ...(role !== Role.ADMIN && organizerId ? {
                    event: {
                        organizerId
                    }
                } : {})
            },
            select: {
                finalPrice: true,
                event: {
                    select: {
                        category: {
                            select: {
                                category: true
                            },
                        },
                    },
                },
            },
        });
    }
}

export const dashboardRepository = new DashboardRepository();