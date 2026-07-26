import { Request, Response } from "express";
import { pointService } from "../services/point.service";
import { success } from "../utils/response";

class PointController {
    async getMyPoints(req: Request, res: Response) {
        const points = await pointService.getMyPoints(req.userId!);

        return success(
            res,
            200,
            "Points retrieved successfully",
            points
        );
    }
}

export const pointController = new PointController();