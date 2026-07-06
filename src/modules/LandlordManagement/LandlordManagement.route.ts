import { Router } from "express";
import { LandlordManagementController } from "./LandlordManagement.controller";
import { auth } from "../../middlewares/auth";

const router = Router();


router.post("/properties",  LandlordManagementController.createPropertyIntoDB);
router.put("/properties/:id",  LandlordManagementController.getPropertyByIdIntoDB);
router.delete("/properties/:id", LandlordManagementController.deleteByIdIntoDB)

router.get("/requests",  LandlordManagementController.getLandlordRequests);


router.patch("/requests/:id",  LandlordManagementController.updateRequestStatus);

export const LandlordManagementRouter = router;