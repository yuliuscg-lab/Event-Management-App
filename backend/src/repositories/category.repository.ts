import {prisma} from "../config/prisma";
import { Prisma } from "@prisma/client";

export class CategoryRepository {
    async findAll() {
        return prisma.category.findMany({
            orderBy: {
                category: "asc",
            },
            where: {
                deletedAt: null,
            }
        });
    }

    async findById(id:number) {
        return prisma.category.findUnique({
            where: { 
                id,
                deletedAt: null, 
            }
        });
    }

    async findByCategory(category: string) {
    return prisma.category.findFirst({
        where: {
            category: {
                equals: category,
                mode: "insensitive",
            },
        },
    });
}

    async create(data: Prisma.CategoryCreateInput) {
        return prisma.category.create({
            data,
        });
    }

    async update(id: number, data: Prisma.CategoryUpdateInput) {
        return prisma.category.update({
            where: {
                id,
            },
            data,
        });
    }

    async softDelete(id:number) {
        return prisma.category.update({
            where: {
                id,
            },
            data: {
                deletedAt: new Date(),
            }
        });
    }
}

export const categoryRepository = new CategoryRepository();