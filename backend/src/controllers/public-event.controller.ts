import { Request, Response } from "express";
import { publicEventService } from "../services/public-event.service";
import { success } from "../utils/response";
import { cuidParamSchema } from "../validation/common.validator";

class PublicEventController {
    async getAll(req: Request, res: Response) {
        const events = await publicEventService.getAll();

        return success(
            res,
            200,
            "Event berhasil diambil",
            events
        );
    }

    async getById(req: Request, res: Response) {
        const {cuid} = cuidParamSchema.parse(req.params);

        const event = await publicEventService.getById(cuid);

        return success(
            res,
            200,
            "Event berhasil diambil",
            event
        );
    }
}

export const publicEventController = new PublicEventController();