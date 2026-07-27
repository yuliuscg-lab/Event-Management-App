import { Prisma } from "@prisma/client";
import { prisma } from "../config/prisma";

export class RefreshTokenRepository {
    async create(data: Prisma.RefreshTokenCreateInput) {
        return prisma.refreshToken.create({
            data,
        });
    }

    async findById(id: string) {
        return prisma.refreshToken.findUnique({
            where:{id}
        })
    }

    async findByJti(jti:string) {
        return prisma.refreshToken.findUnique({
            where: {
                jti,
            },
        });
    }

    async findActiveUserById(userId: string) {
        return prisma.refreshToken.findMany({
            where:{
                userId,
                revokedAt: null,
                expiresAt: {
                    gt: new Date(),
                },
            },
            orderBy: {
                createdAt:"desc",
            },
        });
    }

    async update(
        id: string,
        data: Prisma.RefreshTokenUpdateInput
    ) {
        return prisma.refreshToken.update({
            where:{
                id,
            },
            data,
        });
    }

    async revoke(id:string) {
        return prisma.refreshToken.update({
            where:{
                id,
            },
            data: {
                revokedAt: new Date(),
            },
        });
    }

    async revokeAll(userId:string) {
        return prisma.refreshToken.updateMany({
            where:{
                userId,
                revokedAt: null,
            },
            data: {
                revokedAt: new Date(),
            },
        });
    }

    async deleteExpired() {
        return prisma.refreshToken.deleteMany({
            where: {
                expiresAt: {
                    lt: new Date(),
                },
            },
        });
    }

}

export const refreshTokenRepository = new RefreshTokenRepository();