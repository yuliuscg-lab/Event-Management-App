import { Router } from "express";
import { venueController } from "../controllers/venue.controller";
import { authenticate } from "../middlewares/authenticate.middleware";
import { authorize } from "../middlewares/authorize.middleware";
import { Role } from "@prisma/client";
import { validate } from "../middlewares/validate.middleware";
import { createVenueSchema, updateVenueSchema } from "../validation/venue.validation";

const router = Router();

router.get("/", venueController.getAll.bind(venueController))
router.get("/:id", venueController.getById.bind(venueController))
router.post("/", authenticate, authorize(Role.ADMIN), validate(createVenueSchema), venueController.create.bind(venueController))
router.patch("/:id", authenticate, authorize(Role.ADMIN), validate(updateVenueSchema), venueController.update.bind(venueController))
router.delete("/:id", authenticate, authorize(Role.ADMIN), venueController.delete.bind(venueController))

export default router;