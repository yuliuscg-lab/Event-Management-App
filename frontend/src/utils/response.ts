import { AxiosError } from "axios";

export const getErrorMessage = (error: unknown, defaultMessage?: string): string => {
    const fallback = defaultMessage || "Terjadi kesalahan pada server!";
    if (error instanceof AxiosError) {
        return error.response?.data?.message || error.message || fallback;
    }
    if (error instanceof Error) {
        return error.message || fallback;
    }
    return fallback;
};