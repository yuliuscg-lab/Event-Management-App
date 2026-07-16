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
        const accessToken = generateAccessToken(user.id);
        const refreshToken = generateRefreshToken(user.id,jti);
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
}

export const authService = new AuthService();