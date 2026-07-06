import { Router } from "express";
import { PropertiesController } from "./Properties.controller";

const router = Router();



router.get("/properties", PropertiesController.getProperties)
router.get('/properties/:id', PropertiesController.getPropertyDetails);
router.get('/categories', PropertiesController.getAllCategories);


export const PropertiesRouter = router;