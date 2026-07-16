import { Request, Response } from "express";
import { authService } from "../services/auth.service";
import { success } from "../utils/response";
import { userService } from "../services/user.service";
import { env } from "../config/env";

export async function login(
    req:Request,
    res:Response
) {
    const result = await authService.login(req.body);
    res.cookie(
        "refresh_token",
        result.refreshToken,
        {
            httpOnly:true,
            secure: env.NODE_ENV === "production",
            sameSite: "strict",
            path: "api/auth",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        }
    )
    return success(
        res,
        200,
        "Login berhasil!",
        {
            accessToken: result.accessToken,
            user: result.user,
        }
    );
}

export async function me(req:Request, res:Response) {
    const user = await userService.findById(req.userId);

    return success(
        res,
        200,
        "User retrieved successfully",
        user
    );
}