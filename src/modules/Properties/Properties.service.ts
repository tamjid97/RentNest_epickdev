import { NextFunction, Request, Response } from "express";
import { prisma } from "../../lib/prisma";
import { catchAsync } from "../../utils/catchAsync";
import { PropertyPayload } from "./Properties.interface";
import { sendResponse } from "../../utils/sendRespons.";
import httpStatus  from "http-status";

export const getPropertiesIntoDB = async (filters: any) => {
  const { location, price, type, categoryId } = filters;

  const where: any = {};

  // লোকেশন ফিল্টার
  if (location) {
    where.location = { contains: location, mode: 'insensitive' };
  }

  // প্রাইস ফিল্টার (ইউজার যখন একটা ভ্যালু দিবে)
  if (price) {
    where.price = Number(price); 
  }

  // টাইপ বা ক্যাটাগরি ফিল্টার
  if (type) {
    where.type = { contains: type, mode: 'insensitive' };
  }

  return await prisma.property.findMany({
    where,
    include: { category: true }
  });
};


const getPropertyDetailsFromDB = async (id: string) => {
  const result = await prisma.property.findUnique({
    where: {
      id: id,
    },
    include: {
      category: true, 
      landlord: {
        select: {     
          id: true,
          name: true,
          email: true,
          role: true,
          profilePhoto: true,
        },
      },
    },
  });
  return result;
};


const getAllCategoriesFromDB = async () => {
  const result = await prisma.category.findMany();
  return result;
};


export const PropertiesServices = {
  getPropertiesIntoDB,
  getAllCategoriesFromDB,
  getPropertyDetailsFromDB

};
