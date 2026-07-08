import express, { Application, NextFunction, Request, Response } from "express";
import { authRoutes } from "./modules/auth/auth.route";
import cookieParser from "cookie-parser";
import config from "./config";
import cors from "cors";

import { LandlordManagementRouter } from "./modules/LandlordManagement/LandlordManagement.route";
import { RentalRequestRouter } from "./modules/rentalRequests/rentalRequests.route";
import { PropertiesRouter } from "./modules/Properties/Properties.route";
import { AdminManagementRouter } from "./modules/Admin/admin.route";
import { auth } from "./middlewares/auth";
import { Role } from "../generated/prisma/enums";
import { CategoryRoutes } from "./modules/Category/Category.route";
import { notFound } from "./middlewares/notFound";
import httpStatus from "http-status";
import { globalErrorHandler } from "./middlewares/globalErrorHandler";
import { PaymentRoutes } from "./modules/payments/payments.route";
import { ReviewRoutes } from "./modules/reviews/reviews.routes";
// 🎯 এখানে পেমেন্ট কন্ট্রোলারটি ইমপোর্ট করো (পাথ ঠিক আছে কি না একটু মিলিয়ে নিও)
import { paymentController } from "./modules/payments/payments.controller";

const app: Application = express();

// midelyer 
app.use(cors({
  origin: config.app_url,
  credentials: true,
}));

app.use(cookieParser());

// 🔥 ১. স্ট্রাইপ ওয়েব হুক (অবশ্যই express.json এর আগে থাকতে হবে!)
app.post(
  "/api/payments/webhook",
  express.raw({ type: "application/json" }),
  paymentController.handleWebhook
);

// 📦 ২. গ্লোবাল বডি পার্সার (ওয়েব হুকের নিচে থাকবে)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ৩. বাকি সব রাউট
app.use("/api/payments", PaymentRoutes);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

app.use("/api/auth", authRoutes);
app.use("/api/landlord", auth(Role.LANDLORD), LandlordManagementRouter);
app.use("/api/rentals", RentalRequestRouter);
app.use("/api", PropertiesRouter);
app.use("/api/admin", AdminManagementRouter);
app.use("/api/categories", CategoryRoutes);
app.use("/api/reviews", ReviewRoutes);

app.use(notFound);
app.use(globalErrorHandler);

export default app;