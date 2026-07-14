import { NextFunction, Request, Response } from "express";
import { AnyZodObject, ZodError } from "zod";
import { AppError } from "../errors/AppError";

export const validate = (schema: AnyZodObject) =>
    async (req: Request, res:Response, next:NextFunction) => {
        try {
            req.body = await schema.parseAsync(req.body);
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                return next(
                    new AppError(
                        "Validation failed",
                        400,
                        error.issues
                    )
                );
            }
            
            next(error);
        }
    };