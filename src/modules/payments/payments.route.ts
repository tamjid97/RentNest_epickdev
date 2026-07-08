import express, { Router } from "express";
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

// ২. Confirm/Verify Payment Webhook (POST /api/payments/confirm)
// অ্যাসাইনমেন্টের রিকোয়ারমেন্ট অনুযায়ী এন্ডপয়েন্টটি '/confirm' রাখা হয়েছে
router.post(
    "/confirm", 
    express.raw({ type: "application/json" }), // Stripe Webhook signature-এর জন্য raw body প্রয়োজন
    paymentController.handleWebhook
);

// ৩. Get User's Payment History (GET /api/payments)
router.get(
    "/", 
    auth(Role.TENANT, Role.LANDLORD, Role.ADMIN), 
    paymentController.getAllPayments
);

// ৪. Get Payment Details (GET /api/payments/:id)
router.get(
    "/:id", 
    auth(Role.TENANT, Role.LANDLORD, Role.ADMIN), 
    paymentController.getPaymentById
);

export const PaymentRoutes = router;