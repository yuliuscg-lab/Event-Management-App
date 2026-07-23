import { Prisma } from "@prisma/client";
import { prisma } from "../config/prisma"
import { DB } from "../types/database.types";
export class TicketTypeRepository {

    async findAll(){
        return prisma.ticketType.findMany({
            where: {
                deletedAt:null
            },
        })
    }

    async findById(id:number) {
        return prisma.ticketType.findFirst({
            where: {
                id,
                deletedAt:null,
            },
            include: {
                event:true
            }
        });
    }

    async findByEventId(eventId:string) {
        return prisma.ticketType.findMany({
            where: {
                eventId,
                deletedAt: null
            },
            include: {
                event: true
            },
            orderBy: {
                price: "desc"
            },
        });
    }

    async findByName(eventId:string, ticketType:string) {
        return prisma.ticketType.findFirst({
            where: {
                eventId,
                ticketType: {
                    equals: ticketType,
                    mode: "insensitive"
                },
                deletedAt:null,
            },
        });
    }

    async create(data: Prisma.TicketTypeCreateInput) {
        return prisma.ticketType.create({
            data,
        });
    }

    async update(id:number, data:Prisma.TicketTypeUpdateInput) {
        return prisma.ticketType.update({
            where:{
                id,
            },
            data,
        })
    }

async softDelete(id:number) {
    return prisma.ticketType.update({
        where: {
            id,
        },
        data: {
            deletedAt:new Date(),
        },
    });
}

async reserveTicket(db:DB, id:number, currentSold:number, qty:number) {

    const result = await db.ticketType.updateMany({
        where: {
            id,
            sold: currentSold,
        },
        data:{
            sold: {
                increment: qty,
            },
        },
    });
    return result.count;
}

async releaseTicket(db:DB, id:number, qty:number) {
    return db.ticketType.update({
        where: { id },
        data: {
            sold: {
                decrement: qty,
            },
        },
    });
}
}

export const ticketTypeRepository = new TicketTypeRepository();