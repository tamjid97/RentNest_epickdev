import { Application } from "express";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import fs from "fs";
import path from "path";

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'RentNest API Documentation',
      version: '1.0.0',
      description: 'RentNest Rental Management System API Docs',
    },
    servers: [
      {
        url: 'https://rent-nest-nu-hazel.vercel.app', // 👈 ১. এখানে আপনার আসল ভেরসেল লাইভ URL-টি বসিয়ে দিন
      },
      {
        url: 'http://localhost:5000', // লোকালহোস্ট টেস্ট করার জন্য
      },
    ],
  },
  apis: ['./src/modules/**/*.route.ts', './modules/**/*.route.ts'], 
};

export const setupSwagger = (app: Application): void => {
  const jsonPath = path.join(__dirname, "swagger.json");
  let swaggerDocs: any;

  // লোকালহোস্টে থাকলে (Development) কমেন্ট পড়ে নতুন করে swagger.json ফাইল তৈরি বা আপডেট করবে
  if (process.env.NODE_ENV !== 'production') {
    swaggerDocs = swaggerJsdoc(swaggerOptions);
    fs.writeFileSync(jsonPath, JSON.stringify(swaggerDocs, null, 2), "utf8");
  } else {
    // ভেরসেলে (Production) গেলে সরাসরি আগে থেকে তৈরি হওয়া swagger.json ফাইলটি রিড করবে
    if (fs.existsSync(jsonPath)) {
      swaggerDocs = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
    } else {
      swaggerDocs = swaggerJsdoc(swaggerOptions); // সেফটি ব্যাকআপ
    }
  }

  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
};