import { Router } from "express";
import { PropertiesController } from "./Properties.controller";

const router = Router();



router.get("/properties", PropertiesController.getProperties)


export const PropertiesRouter = router;