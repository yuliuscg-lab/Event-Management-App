import { NextFunction, Request, Response } from "express";
import { authService } from "../services/auth.service";
import { success } from "../utils/response";
import { userService } from "../services/user.service";
import { env } from "../config/env";
import { refreshCookieOptions } from "../utils/cookie";
import { AppError } from "../errors/AppError";

export async function login(
    req:Request,
    res:Response
) {
    const result = await authService.login(req.body);
    res.cookie(
        "refresh_token",
        result.refreshToken,
        refreshCookieOptions
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

export async function refresh(req:Request, res:Response) {
    const result = await authService.refresh(req.cookies.refresh_token);
    res.cookie(
        "refresh_token",
        result.refreshToken,
        refreshCookieOptions
    );

    return success(
        res,
        200,
        "Token Refreshed",
        {
            accessToken: result.accessToken,
        }
    );
}

export async function me(req:Request, res:Response) {
    const user = await userService.findById(req.userId!);

    return success(
        res,
        200,
        "User retrieved successfully",
        user
    );
}

export async function logout(req: Request, res: Response) {
    const refreshToken = req.cookies.refresh_token;

    if (!refreshToken) {
        throw new AppError("Refresh token is required", 401);
    }

    await authService.logout(refreshToken);

    res.clearCookie("refresh_token", refreshCookieOptions);

    return success(
        res,
        200,
        "Logout successful"
    );
}

export async function logoutAll(req: Request, res: Response) {
    const refreshToken = req.cookies.refresh_token;

    if (!refreshToken) {
        throw new AppError("Refresh token is required", 401);
    }

    await authService.logoutAll(refreshToken);

    res.clearCookie("refresh_token", refreshCookieOptions);

    return success(
        res,
        200,
        "Logout from all devices successful"
    );
}

export async function changePassword(req: Request, res: Response) {
    const { currentPassword, newPassword } = req.body;

    await authService.changePassword(
        req.userId!,
        currentPassword,
        newPassword
    );

    res.clearCookie("refresh_token", refreshCookieOptions);

    return success(
        res,
        200,
        "Password changed successfully"
    );
}
