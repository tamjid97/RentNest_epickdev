import { Router } from "express";
import { Role } from "../../../generated/prisma/enums";
import { auth } from "../../middlewares/auth";
import { paymentController } from "./payments.controller";

const router = Router();

// রেন্টাল পেমেন্ট সেশন তৈরি করতে (Tenant এর জন্য)
router.post(
    "/create", 
    auth(Role.TENANT), 
    paymentController.createCheckoutSession
);

// স্ট্রাইপ ওয়েব হুক
router.post("/webhook", paymentController.handleWebhook);

export const PaymentRoutes = router;