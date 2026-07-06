import express,{ Application, Request, Response } from "express";
import { authRoutes } from "./modules/auth/auth.route";
import cookieParser from "cookie-parser";
import config from "./config";
import cors from "cors"

import { LandlordManagementRouter } from "./modules/LandlordManagement/LandlordManagement.route";


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

app.use("/api/landlord", LandlordManagementRouter);

export default app;