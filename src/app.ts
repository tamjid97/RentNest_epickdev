import express,{ Application, NextFunction, Request, Response,  } from "express";
import { authRoutes } from "./modules/auth/auth.route";
import cookieParser from "cookie-parser";
import config from "./config";
import cors from "cors"

import { LandlordManagementRouter } from "./modules/LandlordManagement/LandlordManagement.route";
import { RentalRequestRouter } from "./modules/rentalRequests/rentalRequests.route";
import { PropertiesRouter } from "./modules/Properties/Properties.route";
import { AdminManagementRouter } from "./modules/Admin/admin.route";
import { auth } from "./middlewares/auth";
import { Role } from "../generated/prisma/enums";
import { CategoryRoutes } from "./modules/Category/Category.route";
import { notFound } from "./middlewares/notFound";
import  httpStatus  from "http-status";
import { globalErrorHandler } from "./middlewares/globalErrorHandler";
import { PaymentRoutes } from "./modules/payments/payments.route";




const app : Application = express();



// midelyer 
app.use(cors({
  origin: config.app_url,
  credentials : true,
}))


app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());




app.get('/', (req : Request, res : Response) => {
  res.send('Hello World!')
})


app.use("/api/auth",authRoutes)

app.use("/api/landlord", auth(Role.LANDLORD), LandlordManagementRouter);

app.use("/api/rentals", RentalRequestRouter)

app.use("/api", PropertiesRouter)

app.use("/api/admin", AdminManagementRouter);

app.use("/api/categories", CategoryRoutes);

app.use("/api/payments", PaymentRoutes)


app.use(notFound)

app.use(globalErrorHandler)

export default app;