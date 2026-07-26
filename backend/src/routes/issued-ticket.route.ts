import { Router } from "express";
import { issuedTicketController } from "../controllers/issued-ticket.controller";
import { authenticate } from "../middlewares/authenticate.middleware";
import { authorize } from "../middlewares/authorize.middleware";
import { Role } from "@prisma/client";

const router = Router();

router.use(authenticate);
router.get("/my", issuedTicketController.getMyTickets.bind(issuedTicketController));
router.post("/:code/check-in", authorize(Role.ADMIN, Role.ORGANIZER), issuedTicketController.checkIn.bind(issuedTicketController));

export default router;