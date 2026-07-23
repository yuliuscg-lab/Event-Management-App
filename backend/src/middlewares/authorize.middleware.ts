import { Role } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/AppError";

export function authorize(...roles:Role[]) {
    return (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        if (!req.userRole) {
            return next(
                new AppError("Unauthorized",401)
            );
        }
        
        if(!roles.includes(req.userRole)) {
            return next(
                new AppError("Unauthorized",403)
            );
        }

        next();
    }
}