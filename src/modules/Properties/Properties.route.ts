import { Router } from "express";
import { PropertiesController } from "./Properties.controller";
import { auth } from "../../middlewares/auth";


const router = Router();

// Public Routes
router.get("/properties", PropertiesController.getProperties);
router.get("/properties/:id", PropertiesController.getPropertyDetails);
router.get("/categories", PropertiesController.getAllCategories);

// Landlord Protected Routes (NEXT.JS SERVER ACTION CAME HERE)
router.post("/landlord/properties", auth("LANDLORD"), PropertiesController.createProperty);
router.get("/landlord/properties", auth("LANDLORD"), PropertiesController.getProperties);
router.put("/landlord/properties/:id", auth("LANDLORD"), PropertiesController.updateProperty);
router.delete("/landlord/properties/:id", auth("LANDLORD"), PropertiesController.deleteProperty);

export const PropertiesRouter = router;