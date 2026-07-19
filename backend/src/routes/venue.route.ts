import { Router } from "express";
import { venueController } from "../controllers/venue.controller";
import { authenticate } from "../middlewares/authenticate";
import { authorize } from "../middlewares/authorize";
import { Role } from "@prisma/client";

const router = Router();

router.get("/", venueController.getAll.bind(venueController))
router.get("/:id", venueController.getById.bind(venueController))
router.post("/", authenticate, authorize(Role.ADMIN), venueController.create.bind(venueController))
router.patch("/:id", authenticate, authorize(Role.ADMIN), venueController.update.bind(venueController))
router.delete("/:id", authenticate, authorize(Role.ADMIN), venueController.delete.bind(venueController))

export default router;