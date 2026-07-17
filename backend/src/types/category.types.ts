import { Category } from "@prisma/client";

export interface CreateCategoryRequest {
    name: string;
}

export interface UpdateCategoryRequest {
    name?: string;
}

export type CategoryResponse = Category;