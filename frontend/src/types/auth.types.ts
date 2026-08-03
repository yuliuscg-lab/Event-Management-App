export type Role = "CUSTOMER"|"ORGANIZER"|"ADMIN";

export interface User {
    id: string;
    name: string;
    email: string;
    role: Role;
    refCode: string;
    balancePoints: number;
    couponsCount?: number;
    profile?: {
        id: string;
        avatarUrl: string | null;
    } | null;
}

export interface AuthResponse {
    accessToken: string;
    user: User;
}

export interface ApiResponse<T = unknown> {
    statusCode:number;
    message:string;
    data?:T;
}