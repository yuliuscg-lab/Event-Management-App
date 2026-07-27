import { Request, Response } from "express";
import { paymentService } from "../services/payment.service";
import { success } from "../utils/response";
import { uploadPaymentProofSchema, rejectPaymentSchema } from "../validation/payment.validator";
import { cuidParamSchema } from "../validation/common.validator";

class PaymentController {
    async uploadProof(req: Request, res: Response) {
        const body = uploadPaymentProofSchema.parse(req.body);

        const payment = await paymentService.uploadProof(req.userId!, body);

        return success(
            res,
            200,
            "Bukti pembayaran berhasil diupload",
            payment
        );
    }

    async verify(req: Request, res: Response) {
        const { cuid } = cuidParamSchema.parse(req.params);

        const salesOrder = await paymentService.verifyPayment(req.userId!, cuid);

        return success(
            res,
            200,
            "Pembayaran berhasil diverifikasi",
            salesOrder
        );
    }

    async reject(req: Request, res: Response) {
        const { cuid } = cuidParamSchema.parse(req.params);
        const { reason } = rejectPaymentSchema.parse(req.body);

        const salesOrder = await paymentService.rejectPayment(req.userId!, cuid, reason);

        return success(
            res,
            200,
            "Pembayaran ditolak",
            salesOrder
        );
    }
}

export const paymentController = new PaymentController();