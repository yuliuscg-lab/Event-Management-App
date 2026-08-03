import { Request, Response } from "express";
import { eventService } from "../services/event.service";
import { success } from "../utils/response";
import { cuidParamSchema } from "../validation/common.validator";
import { createEventSchema, updateEventSchema } from "../validation/event.validator";

class EventController {
    async getAll(req: Request, res: Response) {
        const events = await eventService.getAll(req.userId!, req.userRole!);

        return success(
            res,
            200,
            "Events retrieved successfully",
            events
        );
    }

    async getById(req: Request, res: Response) {
        const {cuid} = cuidParamSchema.parse(req.params);

        const event = await eventService.getById(cuid);

        return success(
            res,
            200,
            "Event retrieved successfully",
            event
        );
    }

    async create (req:Request, res: Response) {
        const body = createEventSchema.parse(req.body);

        const event = await eventService.create(
            req.userId!,
            body
        );

        return success(
            res,
            201,
            "Event berhasil dibuat",
            event
        );
    }

    async update(req: Request, res:Response) {
        const {cuid} = cuidParamSchema.parse(req.params);
        const body = updateEventSchema.parse(req.body);

        const event = await eventService.update(
            req.userId!,
            req.userRole!,
            cuid,
            body
        );

        return success(
            res,
            200,
            "Event berhasil diperbarui",
            event
        );
    }

    async delete(req: Request, res:Response) {
        const {cuid} = cuidParamSchema.parse(req.params);
        await eventService.delete(
            req.userId!,
            req.userRole!,
            cuid
        );

        return success(
            res,
            200,
            "Event berhasil dihapus",
        );
    }

    async getAttendees(req: Request, res: Response) {
        const { cuid } = cuidParamSchema.parse(req.params);
        const data = await eventService.getAttendees(
            req.userId!,
            req.userRole!,
            cuid
        );

        return success(
            res,
            200,
            "Attendees retrieved successfully",
            data
        );
    }
}

export const eventController = new EventController();