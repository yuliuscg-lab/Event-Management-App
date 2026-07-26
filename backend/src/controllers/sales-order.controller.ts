import { Request, Response } from "express";
import { salesOrderService } from "../services/sales-order.service";
import { success } from "../utils/response";
import { checkoutSchema } from "../validation/checkout.validator";
import { cuidParamSchema } from "../validation/common.validator";

class SalesOrderController {
    async checkout(req: Request, res: Response) {
        const body = checkoutSchema.parse(req.body);

        const result = await salesOrderService.checkout(req.userId!, body);

        return success(
            res,
            201,
            "Checkout berhasil",
            result
        );
    }

    async getMyOrders(req: Request, res: Response) {
        const orders = await salesOrderService.findByCustomer(req.userId!);

        return success(
            res,
            200,
            "Orders retrieved successfully",
            orders
        );
    }

    async getById(req: Request, res: Response) {
        const { cuid } = cuidParamSchema.parse(req.params);

        const order = await salesOrderService.getById(
            req.userId!,
            req.userRole!,
            cuid
        );

        return success(
            res,
            200,
            "Order retrieved successfully",
            order
        );
    }
}

export const salesOrderController = new SalesOrderController();