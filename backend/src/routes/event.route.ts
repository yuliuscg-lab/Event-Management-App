import { Router } from "express";
import { eventController } from "../controllers/event.controller";
import { authenticate } from "../middlewares/authenticate.middleware";
import { authorize } from "../middlewares/authorize.middleware";
import { Role } from "@prisma/client";
import { createEventSchema, updateEventSchema } from "../validation/event.validator";
import { validate } from "../middlewares/validate.middleware";
import { ticketTypeController } from "../controllers/ticket-type.controller";
import { createTicketTypeSchema } from "../validation/ticket-type.validator";

const router = Router();

router.get("/", authenticate, authorize(Role.ADMIN, Role.ORGANIZER), eventController.getAll.bind(eventController));
router.get("/:cuid", eventController.getById.bind(eventController));
router.post("/", authenticate, authorize(Role.ADMIN, Role.ORGANIZER), validate(createEventSchema), eventController.create.bind(eventController));
router.patch("/:cuid", authenticate, authorize(Role.ADMIN, Role.ORGANIZER), validate(updateEventSchema), eventController.update.bind(eventController));
router.delete("/:cuid", authenticate, authorize(Role.ADMIN, Role.ORGANIZER), eventController.delete.bind(eventController));
router.get("/:cuid/ticket-types", authenticate, authorize(Role.ADMIN, Role.ORGANIZER), ticketTypeController.getByEventId);
router.post("/:cuid/ticket-types", authenticate, authorize(Role.ADMIN, Role.ORGANIZER), validate(createTicketTypeSchema), ticketTypeController.create);

export default router;  