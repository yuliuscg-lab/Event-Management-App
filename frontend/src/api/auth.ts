import { api } from "../lib/axios";
import { ApiResponse, AuthResponse, User } from "../types/auth.types";

export interface RegisterPayload {
    name:string;
    email:string;
    phone:string;
    password:string;
    role: "CUSTOMER" | "ORGANIZER";
    refCodeInput?: string;
}

export interface LoginPayload {
    email:string;
    password:string;
}

export const authService = {
    async register(data: RegisterPayload): Promise<ApiResponse<User>> {
        const response = await api.post<ApiResponse<User>>("/auth/register", data);
        return response.data;
    },

    async login(data: LoginPayload): Promise<ApiResponse<AuthResponse>>{
        const response = await api.post<ApiResponse<AuthResponse>>("/auth/login", data);
        return response.data;
    },

    async me(): Promise<ApiResponse<User>>{
        const response = await api.get<ApiResponse<User>>("/auth/me");
        return response.data;
    },

    async refresh():Promise<ApiResponse<AuthResponse>> {
        const response = await api.post<ApiResponse<AuthResponse>>("/auth/refresh");
        return response.data;
    },

    async logout(): Promise<ApiResponse<null>>{
        const response = await api.post<ApiResponse<null>>("/auth/logout");
        return response.data;
    },
};
