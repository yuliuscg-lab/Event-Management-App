import { Request, Response } from "express";
import { categoryService } from "../services/category.service";
import { success } from "../utils/response";
import { createCategorySchema, updateCategorySchema } from "../validation/category.validator";
import { idParamSchema } from "../validation/common.validator";

class CategoryController {
    async getAll(req: Request, res: Response) {
        const categories = await categoryService.getAll();

        return success(
            res,
            200,
            "Categories retrieved successfully",
            categories
        );
    }

    async getById(req: Request, res: Response) {
        const { id } = idParamSchema.parse(req.params);

        const category = await categoryService.getById(id);

        return success(
            res,
            200,
            "Category retrieved successfully",
            category
        );
    }

    async create(req: Request, res: Response) {
        const body = createCategorySchema.parse(req.body);

        const category = await categoryService.create(body);

        return success(
            res,
            201,
            "Category created successfully",
            category
        );
    }

    async update(req: Request, res: Response) {
        const { id } = idParamSchema.parse(req.params);

        const body = updateCategorySchema.parse(req.body);

        const category = await categoryService.update(id, body);

        return success(
            res,
            200,
            "Category updated successfully",
            category
        );
    }

    async delete(req: Request, res: Response) {
        const { id } = idParamSchema.parse(req.params);

        await categoryService.delete(id);

        return success(
            res,
            200,
            "Category deleted successfully"
        );
    }
}

export const categoryController = new CategoryController();