import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { PropertiesServices } from "./Properties.service";
import { sendResponse } from "../../utils/sendRespons.";
import httpStatus from "http-status";

const getProperties = catchAsync(async (req: Request, res: Response) => {
  const properties = await PropertiesServices.getPropertiesIntoDB(req.query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Properties retrieved successfully",
    data: properties,
  });
});

const getPropertyDetails = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  
  // 🌟 লগইন করা ইউজারের আইডি সংগ্রহ করা হলো (অথেন্টিকেশন মিডলওয়্যার থেকে)
  const user = (req as any).user;
  const userId = user?.id || user?.userId;

  // 🌟 সার্ভিস ফাংশনে id এর সাথে userId ও পাস করে দেওয়া হলো
  const result = await PropertiesServices.getPropertyDetailsFromDB(id as string, userId);

  if (!result) {
    return res.status(httpStatus.NOT_FOUND).json({
      success: false,
      message: "Property not found!",
    });
  }

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Property details retrieved successfully",
    data: result,
  });
});

const getAllCategories = catchAsync(async (req: Request, res: Response) => {
  const result = await PropertiesServices.getAllCategoriesFromDB();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Categories retrieved successfully",
    data: result,
  });
});

// ==========================================
// Create Property Controller
// ==========================================
const createProperty = catchAsync(async (req: Request, res: Response) => {
  const user = (req as any).user; 
  const landlordId = user?.id || user?.userId;

  if (!landlordId) {
    return res.status(httpStatus.UNAUTHORIZED).json({
      success: false,
      message: "Unauthorized access! Landlord ID missing.",
    });
  }

  const result = await PropertiesServices.createPropertyIntoDB(req.body, landlordId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Property created successfully",
    data: result,
  });
});

// ==========================================
// Update Property Controller
// ==========================================
const updateProperty = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = (req as any).user;
  const landlordId = user?.id || user?.userId;

  const result = await PropertiesServices.updatePropertyInDB(id as string, req.body, landlordId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Property updated successfully",
    data: result,
  });
});

// ==========================================
// Delete Property Controller
// ==========================================
const deleteProperty = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = (req as any).user;
  const landlordId = user?.id || user?.userId;

  const result = await PropertiesServices.deletePropertyFromDB(id as string, landlordId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Property deleted successfully",
    data: result,
  });
});

export const PropertiesController = {
  getProperties,
  getPropertyDetails,
  getAllCategories,
  createProperty,
  updateProperty,
  deleteProperty,
};