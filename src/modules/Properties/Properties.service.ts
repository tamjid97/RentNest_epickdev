import { NextFunction, Request, Response } from "express";
import { prisma } from "../../lib/prisma";
import { catchAsync } from "../../utils/catchAsync";
import { PropertyPayload } from "./Properties.interface";
import { sendResponse } from "../../utils/sendRespons.";
import httpStatus  from "http-status";

const getPropertiesIntoDB = async () => {
  

  const createdProperties = await prisma.property.findMany({
    
  })
  return createdProperties;
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
