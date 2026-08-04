import { User } from "../types/auth.types";
import { create } from "zustand";

interface AuthState {
    user: User | null;
    accessToken: string | null;
    isAuthenticated: boolean;
    setAuth: (user: User, accessToken:string) => void;
    setAccessToken: (accessToken:string) => void;
    clearAuth: ()=> void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    accessToken: null,
    isAuthenticated: false,

    setAuth: (user, accessToken) =>
        set({
            user,
            accessToken,
            isAuthenticated:true,
        }),

    setAccessToken: (accessToken) =>
        set({accessToken}),

    clearAuth: () =>
        set({
            user:null,
            accessToken:null,
            isAuthenticated:false,
        }),

    logout: () =>
        set({
            user:null,
            accessToken:null,
            isAuthenticated:false,
        }),
}));