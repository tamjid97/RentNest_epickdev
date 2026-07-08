import { Router } from "express";
import { RentalRequestController } from "./rentalRequests.controller";


const router = Router();

router.post("/",  RentalRequestController.postRentalRequest);
router.get("/",  RentalRequestController.getRentalRequest);
router.get("/:id",  RentalRequestController.getRentalRequestDetails);

export const RentalRequestRouter = router;