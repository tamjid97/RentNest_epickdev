import { Router } from "express";
import { Role } from "../../../generated/prisma/enums";
import { auth } from "../../middlewares/auth";
import { paymentController } from "./payments.controller";

const router = Router();

// ১. রেন্টাল পেমেন্ট সেশন তৈরি করতে (Tenant এর জন্য)
router.post(
    "/create", 
    auth(Role.TENANT), 
    paymentController.createCheckoutSession
);

// ২. স্ট্রাইপ ওয়েব হুক
router.post("/webhook", paymentController.handleWebhook);

// 🔥 ৩. লগইন থাকা ইউজারের সব পেমেন্ট হিস্ট্রি দেখতে
router.get(
    "/", 
    auth(Role.TENANT, Role.LANDLORD, Role.ADMIN), // যে কেউ দেখতে পারবে, ভেতরে ইউজার আইডি ফিল্টার হবে
    paymentController.getAllPayments
);

// 🔥 ৪. নির্দিষ্ট কোনো পেমেন্টের ডিটেইলস দেখতে
router.get(
    "/:id", 
    auth(Role.TENANT, Role.LANDLORD, Role.ADMIN), 
    paymentController.getPaymentById
);

export const PaymentRoutes = router;