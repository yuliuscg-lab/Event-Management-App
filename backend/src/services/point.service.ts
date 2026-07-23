import { EarnSource, Prisma, TransactionType } from "@prisma/client";
import { prisma } from "../config/prisma";
import { AppError } from "../errors/AppError";
import { pointsBucketRepository } from "../repositories/points-bucket.repository";
import { userRepository } from "../repositories/user.repository";
import { pointsLedgerRepository } from "../repositories/points-ledger-repository";
import { pointsDeductionDetailRepository } from "../repositories/points-deduct-details.repository";

export interface BucketUsage {
    bucketId:number;
    amount:number;
}

export interface PointValidationResult {
    pointUsed: number;
    paymentAmount: number;
    buckets: BucketUsage[];
}

export class PointService {
    async validatePointUsage(
        customerId:string,
        subtotalAfterCoupon:number,
    ):Promise<PointValidationResult> {
        const buckets = await pointsBucketRepository.findAvailableBuckets(prisma, customerId,);

        if(buckets.length === 0) {
            return {
                pointUsed: 0,
                paymentAmount: subtotalAfterCoupon,
                buckets: [],
            };
        }

        const totalAvailable = buckets.reduce(
            (sum, bucket) => sum + bucket.remaining,
            0,
        );

        const pointUsed = Math.min(
            totalAvailable,
            subtotalAfterCoupon,
        );

        let remainingPoint = pointUsed;
        const BucketUsage: BucketUsage[] = [];

        for (const bucket of buckets) {
            if (remainingPoint <= 0) break;

            const used = Math.min(bucket.remaining, remainingPoint);

            BucketUsage.push({
                bucketId: bucket.id,
                amount: used,
            });

            remainingPoint -= used;
        }

        return {
            pointUsed,
            paymentAmount: subtotalAfterCoupon - pointUsed,
            buckets: BucketUsage,
        };
    }

    async consumePoint(
        tx: Prisma.TransactionClient,
        customerId: string,
        salesOrderId: string,
        validation: PointValidationResult,
    ): Promise<void> {
        if (validation.pointUsed <= 0) {
            return;
        }

        const ledger = await pointsLedgerRepository.create(tx, {
            amount: validation.pointUsed,
            transactionType: TransactionType.REDEEM,
            source: EarnSource.SALES_ORDER,
            sourceId: salesOrderId,
            customer: {
                connect: {
                    id: customerId,
                },
            },
        });

        for (const item of validation.buckets) {
            const bucket = await pointsBucketRepository.findById(tx, item.bucketId);

            if(!bucket) {
                throw new AppError("Bucket tidak ditemukan!", 404);
            }

            if (bucket.remaining < item.amount) {
                throw new AppError("Saldo point bucket tidak mencukupi!", 400);
            }

            await pointsBucketRepository.decrementRemaining(tx, item.bucketId, item.amount);

            await pointsDeductionDetailRepository.create(tx, {
                amountRedeemed: item.amount,
                bucket: {
                    connect: {
                        id: bucket.id,
                    },
                },
                ledger: {
                    connect: {
                        id: ledger.id,
                    },
                },
            });
        }

        await userRepository.decrementBalancePoints(tx, customerId, validation.pointUsed);
    }
}

export const pointService = new PointService();