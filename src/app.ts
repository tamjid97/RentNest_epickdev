import express, { Application } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import config from "./config";
import httpStatus from "http-status";

import { authRoutes } from "./modules/auth/auth.route";
import { LandlordManagementRouter } from "./modules/LandlordManagement/LandlordManagement.route";
import { RentalRequestRouter } from "./modules/rentalRequests/rentalRequests.route";
import { PropertiesRouter } from "./modules/Properties/Properties.route";
import { AdminManagementRouter } from "./modules/Admin/admin.route";
import { CategoryRoutes } from "./modules/Category/Category.route";
import { PaymentRoutes } from "./modules/payments/payments.route";
import { ReviewRoutes } from "./modules/reviews/reviews.routes";

import { paymentController } from "./modules/payments/payments.controller";
import { auth } from "./middlewares/auth";
import { Role } from "../generated/prisma/enums";
import { notFound } from "./middlewares/notFound";
import { globalErrorHandler } from "./middlewares/globalErrorHandler";


const app: Application = express();

app.use(cors({
  origin: config.app_url,
  credentials: true,
}));

app.use(cookieParser());

// 🔥 রিকোয়ারমেন্ট অনুযায়ী এন্ডপয়েন্ট /api/payments/confirm করা হলো।
// এটি অবশ্যই express.json() এর উপরে থাকবে যেন Raw Body প্রপারলি স্ট্রাইপ পায়।
app.post(
  "/api/payments/confirm",
  express.raw({ type: "application/json" }),
  paymentController.handleWebhook
);

// গ্লোবাল পার্সার (ওয়েবহুকের নিচে)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// রাউটস
app.use("/api/payments", PaymentRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/landlord", auth(Role.LANDLORD), LandlordManagementRouter);
app.use("/api/rentals", auth(Role.TENANT), RentalRequestRouter);
app.use("/api", PropertiesRouter);
app.use("/api/admin", AdminManagementRouter);
app.use("/api/categories", auth(Role.ADMIN), CategoryRoutes);
app.use("/api/reviews", ReviewRoutes);





app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to RentNest API Live Server!",
  });
});

app.use(notFound);
app.use(globalErrorHandler);

export default app;