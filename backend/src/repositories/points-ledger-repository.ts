import { Prisma } from "@prisma/client";
import { DB } from "../types/database.types";

export class PointsLedgerRepository {

    async findById(db: DB, id: number) {
        return db.pointsLedger.findUnique({
            where:{ id }
        });
    }

    async findByCustomer(db: DB, customerId: string) {
        return db.pointsLedger.findMany({
            where: {
                customerId,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    }

    async create(db: DB, data: Prisma.PointsLedgerCreateInput) {
        return db.pointsLedger.create({
            data,
        });
    }

    async update(db: DB, id: number, data: Prisma.PointsLedgerUpdateInput) {
        return db.pointsLedger.update({
            where: { id },
            data,
        });
    }

}

export const pointsLedgerRepository = new PointsLedgerRepository();