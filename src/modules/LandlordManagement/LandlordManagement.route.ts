import { Router } from "express";
import { LandlordManagementController } from "./LandlordManagement.controller";
import { auth } from "../../middlewares/auth";

const router = Router();

router.post("/properties", auth(), LandlordManagementController.createPropertyIntoDB);
router.get("landloard/properties", auth(), LandlordManagementController.getLandlordProperties);
router.put("/properties/:id", auth(), LandlordManagementController.getPropertyByIdIntoDB);
router.delete("/properties/:id", auth(), LandlordManagementController.deleteByIdIntoDB);

router.get("/requests", auth(), LandlordManagementController.getLandlordRequests);
router.patch("/requests/:id", auth(), LandlordManagementController.updateRequestStatus);

export const LandlordManagementRouter = router;