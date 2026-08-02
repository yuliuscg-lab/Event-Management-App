import { Request, Response } from "express";
import { Timeframe } from "../types/dashboard.types";
import { AppError } from "../errors/AppError";
import { dashboardService } from "../services/dashboard.service";
import { success } from "../utils/response";

const ALLOWED_TIMEFRAMES : Timeframe[] = ["1D","1W", "1M", "YTD"];


function parseTimeframe(value:unknown):Timeframe {
    if (typeof value !== "string" || !ALLOWED_TIMEFRAMES.includes(value as Timeframe)) {
        throw new AppError("Timeframe tidak valid!", 400);
    } 
    return value as Timeframe;
}

class DashboardController {
    async getStats(req: Request, res: Response) {
        const data = await dashboardService.getDashboardStats();
        return success(
            res, 
            200, 
            "Statistik dashboard berhasil diambil!",
            data
        );
    }

    async getSalesChart(req:Request, res:Response) {
        const timeframe = parseTimeframe(req.query.timeframe);
        const data = await dashboardService.getSalesChartData(timeframe);

        return success(
            res, 
            200, 
            "Data sales chart berhasil diambil", 
            data
        );
    }

    async getRevenueStream(req:Request, res:Response) {
        const timeframe = parseTimeframe(req.query.timeframe);
        const data = await dashboardService.getRevenueStreamData(timeframe);
        return success(
            res,
            200, 
            "Data revenue stream berhasil diambil", 
            data
        );
    }
}

export const dashboardController = new DashboardController();
