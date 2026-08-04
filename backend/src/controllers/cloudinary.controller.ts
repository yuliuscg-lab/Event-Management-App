import { Request, Response } from "express";
import { uploadBufferToCloudinary } from "../config/cloudinary";
import { AppError } from "../errors/AppError";
import { success } from "../utils/response";

export async function uploadThumbnailController(req: Request, res: Response) {
    if (!req.file) {
        throw new AppError("File gambar wajib diunggah", 400);
    }

    const result = await uploadBufferToCloudinary(req.file.buffer, "thumbnails");

    return success(
        res,
        200,
        "Upload thumbnail berhasil",
        {
            url: result.secure_url,
            publicId: result.public_id,
        }
    )
}

export async function uploadAvatarController(req: Request, res: Response) {
    if (!req.file) {
        throw new AppError("File gambar wajib diunggah", 400);
    }

    const result = await uploadBufferToCloudinary(req.file.buffer, "avatars");

    return success(
        res,
        200,
        "Upload avatar berhasil",
        {
            url: result.secure_url,
            publicId: result.public_id,
        }
    )
}

export async function uploadPaymentProofController(req: Request, res: Response) {
    if (!req.file) {
        throw new AppError("File gambar bukti pembayaran wajib diunggah", 400);
    }

    const result = await uploadBufferToCloudinary(req.file.buffer, "payment_proofs");

    return success(
        res,
        200,
        "Upload bukti pembayaran berhasil",
        {
            url: result.secure_url,
            publicId: result.public_id,
        }
    )
}