import { Prisma } from "@prisma/client";
import { DB } from "../types/database.types";

export class PointsBucketRepository {

    async findById(db:DB, id:number) {
        return db.pointsBucket.findUnique({
            where:{id},
        });
    }

    async findAvailableBuckets(db:DB, customerId: string) {
        return db.pointsBucket.findMany({
            where: {
                customerId,
                remaining: {
                    gt: 0,
                },
                expiredAt: {
                    gt: new Date(),
                },
            },
            orderBy:{
                expiredAt: "asc",
            },
        });
    }

    async create(db:DB, data: Prisma.PointsBucketCreateInput) {
        return db.pointsBucket.create({
            data,
        });
    }

    async update(db:DB, id: number, data: Prisma.PointsBucketUpdateInput) {
        return db.pointsBucket.update({
            where:{id},
            data,
        });
    }

    async delete(db:DB, id:number) {
        return db.pointsBucket.delete({
            where:{id},
        });
    }

    async decrementRemaining(
        db:DB, 
        id:number, 
        amount:number
    ) {
        return db.pointsBucket.update({
            where: {id},
            data: {
                remaining: {
                    decrement: amount,
                },
            },
        });
    }
}

export const pointsBucketRepository = new PointsBucketRepository();