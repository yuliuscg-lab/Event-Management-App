import multer from "multer";
import { AppError } from "../errors/AppError";

const storage = multer.memoryStorage();

const fileFilter = (_req: any, file: Express.Multer.File, cb:multer.FileFilterCallback)=> {
    if(!file.mimetype.startsWith("image/")){
        return cb(new AppError("File harus berupa gambar (JPG, PNG, WEBP)!", 400) as any, false);
    }
    cb(null, true);
};

export const uploadSingleImage = multer({ 
    storage, 
    fileFilter, 
    limits: { fileSize: 5*1024*1024 }
});
