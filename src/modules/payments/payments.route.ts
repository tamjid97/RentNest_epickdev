import { Router } from "express";
import { Role } from "../../../generated/prisma/enums";
import { auth } from "../../middlewares/auth";
import { paymentController } from "./payments.controller";

const router = Router();

// ১. Create Payment Session (POST /api/payments/create)
router.post(
    "/create", 
    auth(Role.TENANT), 
    paymentController.createCheckoutSession
);

// ২. Get User's Payment History (GET /api/payments)
router.get(
    "/", 
    auth(Role.TENANT, Role.LANDLORD, Role.ADMIN), 
    paymentController.getAllPayments
);

// ৩. Get Payment Details (GET /api/payments/:id)
router.get(
    "/:id", 
    auth(Role.TENANT, Role.LANDLORD, Role.ADMIN), 
    paymentController.getPaymentById
);

export const PaymentRoutes = router;