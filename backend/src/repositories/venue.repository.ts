import {prisma} from "../config/prisma";
import {Prisma} from "@prisma/client";

export class VenueRepository {
    async findAll() {
        return prisma.venue.findMany({
            where: {
                deletedAt: null,
            },
            orderBy: {
                venueName: "asc",
            },
        });
    }

    async findById(id: number) {
        return prisma.venue.findUnique({
            where: {
                id,
                deletedAt: null,
            },
        });
    }

    async findByName(venueName: string) {
        return prisma.venue.findFirst({
            where: {
                venueName: {
                    equals: venueName,
                    mode: "insensitive",
                },
                deletedAt: null,
            },
        });
    }

    async create(data: Prisma.VenueCreateInput) {
        return prisma.venue.create({
            data,
        });
    }

    async update(id: number, data: Prisma.VenueUpdateInput) {
        return prisma.venue.update({
            where: {
                id,
            },
            data,
        });
    }

    async softDelete(id:number) {
        return prisma.venue.update({
            where: {
                id,
            },
            data: {
                deletedAt: new Date(),
            },
        });
    }
}

export const venueRepository = new VenueRepository();