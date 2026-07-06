import { Router } from "express";
import { AuthController } from "./auth.controller";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";


const router = Router();



router.post("/register", AuthController.createRegisterUser)
router.post("/login", AuthController.loginUser)
router.get("/me", auth(Role.ADMIN,Role.LANDLORD,Role.TENANT,Role.USER) ,AuthController.getMe)

export const authRoutes = router;