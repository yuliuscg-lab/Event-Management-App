import { Prisma } from "@prisma/client";
import { DB } from "../types/database.types";


export class PointsDeductionDetailRepository {
    async findByLedger(db:DB, ledgerId:number) {
        return db.pointsDeductionDetail.findMany({
            where: {
                ledgerId,
            },
            orderBy: {
                id:"asc",
            },
        });
    }

    async create(db:DB, data: Prisma.PointsDeductionDetailCreateInput,) {
        return db.pointsDeductionDetail.create({
            data,
        });
    }

    async delete(db:DB, id:number) {
        return db.pointsDeductionDetail.delete({
            where: {
                id,
            },
        });
    }
}

export const pointsDeductionDetailRepository = new PointsDeductionDetailRepository();