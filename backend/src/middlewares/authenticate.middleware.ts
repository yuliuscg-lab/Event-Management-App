import { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/AppError";
import jwt, { JwtPayload } from "jsonwebtoken";
import { env } from "../config/env";
import { verifyAccessToken } from "../utils/jwt";

export function authenticate (req:Request, res:Response, next:NextFunction) {
    const authorization = req.headers.authorization;

    if (!authorization || !authorization.startsWith("Bearer ")) {
        return next(new AppError("Unauthorized", 401));
    }

    const token = authorization.split(" ")[1];

    try {
        const payload = verifyAccessToken(token);
        req.userId = payload.sub as string;
        req.userRole = payload.role;
        next();
    } catch {
        throw new AppError("Invalid token!",401)
    }
}