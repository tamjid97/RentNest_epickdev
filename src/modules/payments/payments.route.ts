import express, { Router } from "express";
import { Role } from "../../../generated/prisma/enums";
import { auth } from "../../middlewares/auth";
import { paymentController } from "./payments.controller";

const router = Router();


router.post(
    "/create", 
    auth(Role.TENANT), 
    paymentController.createCheckoutSession
);



router.get(
    "/", 
    auth(Role.TENANT, Role.LANDLORD, Role.ADMIN), 
    paymentController.getAllPayments
);


router.get(
    "/:id", 
    auth(Role.TENANT, Role.LANDLORD, Role.ADMIN), 
    paymentController.getPaymentById
);

export const PaymentRoutes = router;