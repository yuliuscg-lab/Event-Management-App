import { Request, Response } from "express";
import { issuedTicketService } from "../services/issued-ticket.service";
import { success } from "../utils/response";
import { ticketCodeParamSchema } from "../validation/common.validator";

class IssuedTicketController {
    async getMyTickets(req: Request, res: Response) {
        const tickets = await issuedTicketService.getMyTickets(req.userId!);

        return success(
            res,
            200,
            "Tickets retrieved successfully",
            tickets
        );
    }

    async checkIn(req: Request, res: Response) {
        const { code } = ticketCodeParamSchema.parse(req.params);

        const ticket = await issuedTicketService.checkIn(code);

        return success(
            res,
            200,
            "Check-in berhasil",
            ticket
        );
    }
}

export const issuedTicketController = new IssuedTicketController();