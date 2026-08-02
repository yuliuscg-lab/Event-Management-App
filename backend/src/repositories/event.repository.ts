import { prisma } from "../config/prisma";
import { EventStatus, Prisma } from "@prisma/client";

export class EventRepository {
    async findAll() {
        return prisma.event.findMany({
            where: {
                deletedAt: null
            },
            include: {
                category:true,
                venue:true,
                organizer:true,
                ticketTypes:true,
            },
            orderBy: {
                createdAt: "desc"
            }
        });
    }

    async findByOrganizerId(organizerId: string) {
        return prisma.event.findMany({
            where: {
                organizerId,
                deletedAt:null,
            },
            include: {
                category: true,
                venue: true,
                organizer: true,
                ticketTypes:true
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    }

    async findPublished() {
        return prisma.event.findMany({
            where: {
                deletedAt:null,
                status: EventStatus.PUBLISHED,
            },
            include: {
                category:true,
                venue:true,
                organizer: {
                    select: {
                        id:true,
                        name: true
                    },
                },
                ticketTypes:true
            },
            orderBy: {
                eventDate: "asc",
            },
        })
    }

    async findPublishedById(id:string) {
        return prisma.event.findFirst({
            where: {
                id,
                deletedAt:null,
                status: EventStatus.PUBLISHED,
            },
            include: {
                category:true,
                venue:true,
                organizer: {
                    select: {
                        id:true,
                        name:true
                    },
                },
                ticketTypes:true
            },
        });
    }

    async findById(id: string) {
        return prisma.event.findFirst({
            where:{
                id,
                deletedAt:null
            },
            include: {
                category:true,
                venue:true,
                organizer:true,
                ticketTypes:true
            }
        });
    }

    async findByTitle(eventTitle:string) {
        return prisma.event.findUnique({
            where: {
                eventTitle
            }
        });
    }

    async create(data: Prisma.EventCreateInput) {
        return prisma.event.create({
            data,
        });
    }

    async update(id:string, data:Prisma.EventUpdateInput) {
        return prisma.event.update({
            where: {
                id,
            },
            data,
        });
    }

    async softDelete(id:string) {
        return prisma.event.update({
            where:{
                id,
            },
            data:{
                deletedAt:new Date()
            }
        });
    }
}

export const eventRepository = new EventRepository();