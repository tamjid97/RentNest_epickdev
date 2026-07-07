import express, { Router } from "express";
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

// ⚠️ ওয়েব হুক এখান থেকে সরিয়ে সরাসরি app.ts এ নিয়ে যাওয়া হয়েছে!

// ৩. লগইন থাকা ইউজারের সব পেমেন্ট হিস্ট্রি দেখতে
router.get(
    "/", 
    auth(Role.TENANT, Role.LANDLORD, Role.ADMIN), 
    paymentController.getAllPayments
);

// ৪. নির্দিষ্ট কোনো পেমেন্টের ডিটেইলস দেখতে
router.get(
    "/:id", 
    auth(Role.TENANT, Role.LANDLORD, Role.ADMIN), 
    paymentController.getPaymentById
);

export const PaymentRoutes = router;