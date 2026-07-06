import { Router } from "express";
import { LandlordManagementController } from "./LandlordManagement.controller";
import { auth } from "../../middlewares/auth";

const router = Router();


router.post("/properties", auth(), LandlordManagementController.createPropertyIntoDB);
router.put("/properties/:id", auth(), LandlordManagementController.getPropertyByIdIntoDB);

export const LandlordManagementRouter = router;