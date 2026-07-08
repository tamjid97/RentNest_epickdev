import express from "express";
import { CategoryController } from "./Category.controller";

const router = express.Router();

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: সব ক্যাটাগরির লিস্ট নিয়ে আসা (Get All Categories)
 *     tags: [Categories]
 *     description: ডাটাবেজে থাকা সকল প্রোপার্টি ক্যাটাগরির লিস্ট দেখতে এই এপিআই কল করুন।
 *     responses:
 *       200:
 *         description: সফল রেসপন্স (Success Response)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Categories retrieved successfully"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: "cat_123"
 *                       name:
 *                         type: string
 *                         example: "Apartment"
 *       500:
 *         description: ইন্টারনাল সার্ভার এরর (Internal Server Error)
 */
router.get("/", CategoryController.getAllCategories);


/**
 * @swagger
 * /api/categories:
 *   post:
 *     summary: নতুন ক্যাটাগরি তৈরি করা (Create Category)
 *     tags: [Categories]
 *     description: এডমিন প্যানেল থেকে নতুন একটি প্রোপার্টি ক্যাটাগরি তৈরি করার জন্য।
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Duplex House"
 *     responses:
 *       201:
 *         description: সফলভাবে ক্যাটাগরি তৈরি হয়েছে (Created)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Category created successfully"
 *                 data:
 *                   type: object
 *       400:
 *         description: ব্যাড রিকোয়েস্ট (ইনপুট ডাটা মিসিং বা ভুল হলে)
 */
router.post("/", CategoryController.createCategory);

export const CategoryRoutes = router;