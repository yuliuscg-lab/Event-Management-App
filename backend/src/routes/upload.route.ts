import { Router } from "express";
import { authenticate } from "../middlewares/authenticate.middleware";
import { authorize } from "../middlewares/authorize.middleware";
import { Role } from "@prisma/client";
import { uploadAvatarController, uploadThumbnailController } from "../controllers/cloudinary.controller";
import { uploadSingleImage } from "../middlewares/upload.middleware";

const router = Router();

router.use(authenticate);

router.post("/thumbnail", authorize(Role.ORGANIZER, Role.ADMIN), uploadSingleImage.single("image"), uploadThumbnailController);
router.post("/avatar", authorize(Role.ORGANIZER, Role.ADMIN), uploadSingleImage.single("image"), uploadAvatarController);

export default router;