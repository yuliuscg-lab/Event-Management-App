import { Prisma } from "@prisma/client";
import { DB } from "../types/database.types";

export class PointsReservationRepository {

    async create(db: DB, data: Prisma.PointsReservationCreateInput) {
        return db.pointsReservation.create({
            data,
        });
    }

    async findBySalesOrderId(db: DB, salesOrderId: string) {
        return db.pointsReservation.findMany({
            where: { salesOrderId },
        });
    }

    async deleteBySalesOrderId(db: DB, salesOrderId: string) {
        return db.pointsReservation.deleteMany({
            where: { salesOrderId },
        });
    }
}

export const pointsReservationRepository = new PointsReservationRepository();