import { Router } from "express";
import { PropertiesController } from "./Properties.controller";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";


const router = Router();

// Public Routes
router.get("/properties", auth(Role.LANDLORD,Role.ADMIN,Role.TENANT), PropertiesController.getProperties);
router.get("/properties/:id",  auth(Role.LANDLORD,Role.ADMIN,Role.TENANT),PropertiesController.getPropertyDetails);
router.get("/categories",  auth(Role.LANDLORD,Role.ADMIN,Role.TENANT),PropertiesController.getAllCategories);

// Landlord Protected Routes (NEXT.JS SERVER ACTION CAME HERE)
router.post("/landlord/properties", auth(Role.LANDLORD), PropertiesController.createProperty);
router.get("/landlord/properties", auth(Role.LANDLORD), PropertiesController.getProperties);
router.put("/landlord/properties/:id", auth(Role.LANDLORD), PropertiesController.updateProperty);
router.delete("/landlord/properties/:id", auth(Role.LANDLORD), PropertiesController.deleteProperty);

export const PropertiesRouter = router;