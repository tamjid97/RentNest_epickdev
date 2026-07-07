import { Router } from "express";
import { Role } from "../../../generated/prisma/enums";
import { auth } from "../../middlewares/auth";
import { paymentController } from "./payments.controller";


const router = Router()

router.post(
    "/checkout", 
    auth(Role.TENANT, Role.LANDLORD, Role.ADMIN),
    paymentController.createCheckoutSession
)

//cancel subscription

router.post("/webhook", paymentController.handleWebhook )


router.get("/status", 
    auth(Role.TENANT, Role.LANDLORD, Role.ADMIN),
    paymentController.getSubscriptionStatus)

export const PaymentRoutes = router