import { Router } from "express";
import { AuthController } from "./auth.controller";


const router = Router();



router.post("/register", AuthController.createRegisterUser)

export const authRoutes = router;