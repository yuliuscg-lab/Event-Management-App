import { Router } from "express";
import { paymentController } from "../controllers/payment.controller";
import { authenticate } from "../middlewares/authenticate.middleware";
import { authorize } from "../middlewares/authorize.middleware";
import { validate } from "../middlewares/validate.middleware";
import { Role } from "@prisma/client";
import { uploadPaymentProofSchema, rejectPaymentSchema } from "../validation/payment.validator";

const router = Router();

router.use(authenticate);
router.post("/upload-proof", validate(uploadPaymentProofSchema), paymentController.uploadProof.bind(paymentController));
router.post("/:cuid/verify", authorize(Role.ADMIN), paymentController.verify.bind(paymentController));
router.post("/:cuid/reject", authorize(Role.ADMIN), validate(rejectPaymentSchema), paymentController.reject.bind(paymentController));

export default router;