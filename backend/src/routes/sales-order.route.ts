import { Router } from "express";
import { salesOrderController } from "../controllers/sales-order.controller";
import { authenticate } from "../middlewares/authenticate.middleware";
import { validate } from "../middlewares/validate.middleware";
import { checkoutSchema } from "../validation/checkout.validator";

import { authorize } from "../middlewares/authorize.middleware";
import { Role } from "@prisma/client";

const router = Router();

router.use(authenticate);
router.get("/organizer", authorize(Role.ADMIN, Role.ORGANIZER), salesOrderController.getOrganizerOrders.bind(salesOrderController));
router.post("/checkout", validate(checkoutSchema), salesOrderController.checkout.bind(salesOrderController));
router.get("/my", salesOrderController.getMyOrders.bind(salesOrderController));
router.get("/:cuid", salesOrderController.getById.bind(salesOrderController));

export default router;