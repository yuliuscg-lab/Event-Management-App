import { Router } from "express";
import { ticketTypeController } from "../controllers/ticket-type.controller";
import { authenticate } from "../middlewares/authenticate.middleware";
import { authorize } from "../middlewares/authorize.middleware"
import { Role } from "@prisma/client";
import { validate } from "../middlewares/validate.middleware";
import { createTicketTypeSchema, updateTicketTypeSchema } from "../validation/ticket-type.validator";

const router = Router();

router.use(authenticate);
router.get("/", authorize(Role.ADMIN), ticketTypeController.getAll);
router.get("/:id", authorize(Role.ADMIN, Role.ORGANIZER), ticketTypeController.getById);
router.patch("/:id", authorize(Role.ADMIN, Role.ORGANIZER), validate(updateTicketTypeSchema), ticketTypeController.update);
router.delete("/:id", authorize(Role.ADMIN, Role.ORGANIZER), ticketTypeController.delete);

export default router;