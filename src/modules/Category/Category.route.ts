import express from "express";
import { CategoryController } from "./Category.controller";



const router = express.Router();


router.get("/", CategoryController.getAllCategories);


router.post("/", CategoryController.createCategory);

export const CategoryRoutes = router;