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

import { paymentController } from "./modules/payments/payments.controller";

const app: Application = express();


app.use(cors({
  origin: config.app_url,
  credentials: true,
}));

app.use(cookieParser());


app.post(
  "/api/payments/webhook",
  express.raw({ type: "application/json" }),
  paymentController.handleWebhook
);


app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use("/api/payments", PaymentRoutes);

app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to RentNest API Live Server!",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/landlord", auth(Role.LANDLORD), LandlordManagementRouter);
app.use("/api/rentals", auth(Role.TENANT), RentalRequestRouter);
app.use("/api", PropertiesRouter);
app.use("/api/admin", AdminManagementRouter);
app.use("/api/categories",auth(Role.ADMIN), CategoryRoutes);
app.use("/api/reviews", ReviewRoutes);

app.use(notFound);
app.use(globalErrorHandler);

export default app;