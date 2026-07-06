import { Router } from "express";

import { auth } from "../../middlewares/auth";
import { AdminManagementController } from "./admin.controller";

const router = Router();


router.get("/users", auth("ADMIN"), AdminManagementController.getAllUsersFromDB);


router.patch("/users/:id", auth("ADMIN"), AdminManagementController.updateUserStatusIntoDB);


router.get("/properties", auth("ADMIN"), AdminManagementController.getAllPropertiesFromDB);


router.get("/rentals", auth("ADMIN"), AdminManagementController.getAllRentalsFromDB);

export const AdminManagementRouter = router;