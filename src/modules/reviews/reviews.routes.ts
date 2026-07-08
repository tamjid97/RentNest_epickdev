import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { reviewController } from "./reviews.controller";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

router.post(
    "/", 
    auth(Role.TENANT), 
    reviewController.createReview
);

export const ReviewRoutes = router;