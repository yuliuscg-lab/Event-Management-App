import { AxiosError } from "axios";

export const getErrorMessage = (error: unknown):string => {
    if (error instanceof AxiosError) {
        return error.response?.data?.message || error.message || "Terjadi kesalahan pada server!"
    }
    if (error instanceof Error) {
        return error.message;
    }
    return "Terjadi kesalahan yang tidak diketahui!";
}