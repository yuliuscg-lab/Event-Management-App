import { Router } from "express";
import { ticketTypeController } from "../controllers/ticket-type.controller";
import { authenticate } from "../middlewares/authenticate.middleware";
import { authorize } from "../middlewares/authorize.middleware";
import { Role } from "@prisma/client";
import { validate } from "../middlewares/validate.middleware";
import { updateTicketTypeSchema } from "../validation/ticket-type.validator";

const router = Router();

router.use(authenticate);
router.get("/", authorize(Role.ADMIN), ticketTypeController.getAll.bind(ticketTypeController));
router.get("/:id", authorize(Role.ADMIN, Role.ORGANIZER), ticketTypeController.getById.bind(ticketTypeController));
router.patch("/:id", authorize(Role.ADMIN, Role.ORGANIZER), validate(updateTicketTypeSchema), ticketTypeController.update.bind(ticketTypeController));
router.delete("/:id", authorize(Role.ADMIN, Role.ORGANIZER), ticketTypeController.delete.bind(ticketTypeController));

export default router;