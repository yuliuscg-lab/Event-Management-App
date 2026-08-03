import { api } from "@/lib/axios";
import { ApiResponse } from "@/types/auth.types";

export interface UploadImageResponse {
    url: string;
    publicId: string;
}

export async function uploadThumbnail(file: File): Promise<UploadImageResponse> {
    const formData = new FormData();
    formData.append("image", file);

    const response = await api.post<ApiResponse<UploadImageResponse>>(
        "/uploads/thumbnail",
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );

    return response.data.data!;
}

export async function uploadAvatar(file: File): Promise<UploadImageResponse> {
    const formData = new FormData();
    formData.append("image", file);

    const response = await api.post<ApiResponse<UploadImageResponse>>(
        "/uploads/avatar",
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );

    return response.data.data!;
}
