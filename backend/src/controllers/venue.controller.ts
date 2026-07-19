import { NextFunction, Request, Response } from "express";
import { venueService } from "../services/venue.service";
import { success } from "../utils/response";
import { idParamSchema } from "../validation/common.validator";
import { createVenueSchema, updateVenueSchema } from "../validation/venue.validation";

class VenueController {
    async getAll(req:Request, res: Response) {
        const venues = await venueService.getAll();

        return success(
            res,
            200,
            "Venues retrieved successfully",
            venues
        );
    }

    async getById(req:Request, res: Response) {
        const {id} = idParamSchema.parse(req.params);
        const venue = await venueService.getById(id);

        return success(
            res,
            200,
            "Venue retrieved successfully",
            venue
        );
    }

    async create(req: Request, res:Response) {
        const body = createVenueSchema.parse(req.body);

        const venue = await venueService.create(body);

        return success(
            res,
            201,
            "Venue created successfully",
            venue
        );
    }

    async update(req:Request, res:Response) {
        const {id} = idParamSchema.parse(req.params);
        const body = updateVenueSchema.parse(req.body);

        const venue = await venueService.update(id, body);
        
        return success(
            res,
            200,
            "Venue updated successfully",
            venue
        );
    }

    async delete(req:Request, res:Response) {
        const {id} = idParamSchema.parse(req.params);
        await venueService.delete(id);
        
        return success(
            res,
            200,
            "Venue deleted successfully",
        )
    }
    
}

export const venueController = new VenueController();