import { Category } from "@prisma/client";

export interface CreateCategoryRequest {
    category: string;
}

export interface UpdateCategoryRequest {
    category?: string;
}

export type CategoryResponse = Category;