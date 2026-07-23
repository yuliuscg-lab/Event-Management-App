import { Role } from "@prisma/client";
import { z } from "zod";

export const createUserSchema = z.object({
    name: z.string()
        .trim()
        .min(4, "Nama wajib diisi, minimal 4 karakter!")
        .regex(/^[a-zA-Z0-9 ]+$/, "Nama hanya boleh berisi huruf, angka, dan spasi!"),
    email: z.string().trim().email("Email tidak valid!"),
    password: z.string().min(8, "Password minimal 8 karakter!"),
    role: z.nativeEnum(Role),
    phone: z.string().trim().min(8, "Nomor telepon wajib diisi"),
    refCodeInput: z.string().optional()
});

export const updateUserSchema = z.object({
    phone: z.string().min(10, "Nomor telepon tidak valid!").optional(),
    name: z.string().min(4, "Nama minimal 4 karakter!").optional()
});