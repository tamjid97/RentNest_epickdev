import { Router } from "express";
import { RentalRequestController } from "./rentalRequests.controller";
import { auth } from "../../middlewares/auth";

const router = Router();

router.post("/", auth(), RentalRequestController.postRentalRequest);
router.get("/", auth(), RentalRequestController.getRentalRequest);
router.get("/:id", auth(), RentalRequestController.getRentalRequestDetails);

export const RentalRequestRouter = router;