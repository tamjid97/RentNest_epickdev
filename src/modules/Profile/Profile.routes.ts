import { Router } from "express";
import { auth } from "../../middlewares/auth";

import { Role } from "../../../generated/prisma/enums";
import { profileController } from "./Profile.controller";

const router = Router();

router.get(
    "/me", 
    auth(Role.TENANT, Role.LANDLORD, Role.ADMIN), 
    profileController.getMyProfile
);

router.patch(
    "/update-profile", 
    auth(Role.TENANT, Role.LANDLORD, Role.ADMIN), 
    profileController.updateMyProfile
);

export const ProfileRoutes = router;