import { Request, Response } from "express";
import { success } from "../utils/response";
import { ticketTypeService } from "../services/ticket-type.service";
import { createTicketTypeSchema, updateTicketTypeSchema } from "../validation/ticket-type.validator";
import { cuidParamSchema, idParamSchema } from "../validation/common.validator";

class TicketTypeController {
    async getAll(req: Request, res: Response) {
        const tickets = await ticketTypeService.getAll();

        return success(
            res,
            200,
            "Berhasil mendapatkan seluruh ticket type",
            tickets
        );
    }

    async getById(req: Request, res: Response) {
        const { id } = idParamSchema.parse(req.params);

        const ticket = await ticketTypeService.getById(id);

        return success(
            res,
            200,
            "Berhasil mendapatkan ticket type",
            ticket
        );
    }

    async getByEventId(req: Request, res: Response) {
        const { cuid } = cuidParamSchema.parse(req.params);

        const tickets = await ticketTypeService.getByEventId(cuid);

        return success(
            res,
            200,
            "Berhasil mendapatkan ticket berdasarkan event",
            tickets
        );
    }

    async create(req: Request, res: Response) {
        const { cuid } = cuidParamSchema.parse(req.params);

        const body = createTicketTypeSchema.parse(req.body);

        const ticket = await ticketTypeService.create(
            req.userId!,
            req.userRole!,
            cuid,
            body
        );

        return success(
            res,
            201,
            "Ticket berhasil dibuat",
            ticket
        );
    }

    async update(req: Request, res: Response) {
        const { id } = idParamSchema.parse(req.params);

        const body = updateTicketTypeSchema.parse(req.body);

        const ticket = await ticketTypeService.update(
            req.userId!,
            req.userRole!,
            id,
            body
        );

        return success(
            res,
            200,
            "Ticket berhasil diupdate",
            ticket
        );
    }

    async delete(req: Request, res: Response) {
        const { id } = idParamSchema.parse(req.params);

        await ticketTypeService.delete(
            req.userId!,
            req.userRole!,
            id
        );

        return success(
            res,
            200,
            "Ticket berhasil dihapus",
            null
        );
    }
}

export const ticketTypeController = new TicketTypeController();