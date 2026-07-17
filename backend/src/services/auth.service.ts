import { AppError } from "../errors/AppError";
import { toUserResponse } from "../mappers/user.mapper";
import { refreshTokenRepository } from "../repositories/refresh-token.repository";
import { userRepository } from "../repositories/user.repository";
import { LoginUser } from "../types/auth.types";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../utils/jwt";
import { comparePassword, hashPassword } from "../utils/password";
import crypto from "crypto";


export class AuthService {
    async login(data:LoginUser) {
        const user = await userRepository.findByEmail(data.email);
        
        if(!user) {
            throw new AppError("Email atau password salah!", 401);
        };

        const isMatch = await comparePassword(
            data.password,
            user.password
        );

        if(!isMatch) {
            throw new AppError("Email atau password salah!", 401);
        };
        const jti = crypto.randomUUID();
        const accessToken = generateAccessToken(user.id, user.role);
        const refreshToken = generateRefreshToken(user.id,user.role,jti);
        const hashedRefreshToken = await hashPassword(refreshToken);

        const payload = verifyRefreshToken(refreshToken);
        const expiresAt = new Date(
            payload.exp! * 1000
        );

        await refreshTokenRepository.create({
        jti,
        tokenHash: hashedRefreshToken,
        expiresAt,
        user: {
            connect: {
                id: user.id
            },
        },
        });
        return {
            accessToken,
            refreshToken,
            user: toUserResponse(user),
        }
    }

    async refresh (
        refreshToken:string
    ) {
        const payload = verifyRefreshToken(refreshToken);
        const tokenRecord = await refreshTokenRepository.findByJti(payload.jti!);

        if(!tokenRecord || tokenRecord.revokedAt) {
            throw new AppError("Unauthorized!", 401);
        }

        const isValid = await comparePassword(refreshToken,tokenRecord.tokenHash);

        if (!isValid || new Date() > tokenRecord.expiresAt) {
            throw new AppError("Unauthorized",401);
        }

        const newJti = crypto.randomUUID();
        const userId = payload.sub as string;
        const accessToken = generateAccessToken(
            userId,
            payload.role
        );

        const newRefreshToken = generateRefreshToken(userId,payload.role,newJti);
        const hashedRefreshToken = await hashPassword(newRefreshToken);
        const expiresAt = new Date(
            payload.exp! * 1000
        );

        await refreshTokenRepository.update(
            tokenRecord.id,
            {
                jti:newJti,
                tokenHash: hashedRefreshToken,
                expiresAt,
            }
        );

        return {
            accessToken,
            refreshToken: newRefreshToken,
        };

    }

    async logout (refreshToken:string): Promise<void> {
        const payload = verifyRefreshToken(refreshToken);

        const tokenRecord = await refreshTokenRepository.findByJti(payload.jti!);

        if(!tokenRecord || tokenRecord.revokedAt) {
            throw new AppError("Unauthorized", 401);
        }

        const isValid = await comparePassword(refreshToken, tokenRecord.tokenHash);

        if(!isValid) {
            throw new AppError("Unauthorized", 401);
        }

        await refreshTokenRepository.revoke(tokenRecord.id);

    }

    async logoutAll(refreshToken:string) {
        const payload = verifyRefreshToken(refreshToken);

        const tokenRecord = await refreshTokenRepository.findByJti(payload.jti!);

        if(!tokenRecord || tokenRecord.revokedAt) {
            throw new AppError("Unauthorized",401);
        }

        const isValid = await comparePassword(refreshToken,tokenRecord.tokenHash);

        if(!isValid) {
            throw new AppError("Unauthorized", 401);
        }

        await refreshTokenRepository.revokeAll(tokenRecord.userId);
    }

    async changePassword(
        userId:string,
        currentPassword:string,
        newPassword:string
    ):Promise<void> {
        const user = await userRepository.findById(userId);

        if (!user) {
            throw new AppError("User tidak ditemukan!",404);
        } 

        const isMatch = await comparePassword(currentPassword, user.password);
        if (!isMatch) {
            throw new AppError("Pasword saat ini salah",401);
        }

        if(await comparePassword(newPassword,user.password)) {
            throw new AppError(
                "Password baru tidak boleh sama dengan password saat ini!", 400
            );
        }

        const hashedPassword = await hashPassword(newPassword);
        await userRepository.update(user.id,{password:hashedPassword});
        await refreshTokenRepository.revokeAll(user.id);
    }
}

export const authService = new AuthService();