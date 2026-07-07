import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { PropertiesServices } from "./Properties.service";
import { sendResponse } from "../../utils/sendRespons.";
import  httpStatus  from "http-status";




const getProperties = catchAsync(async(req: Request, res: Response, next: NextFunction)=>{

const properties = await PropertiesServices.getPropertiesIntoDB(req.query);

sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Properties retrieved successfully",
      data: properties
    });
})





const getPropertyDetails = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  
  const result = await PropertiesServices.getPropertyDetailsFromDB(id as string);

  if (!result) {
    return res.status(404).json({
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


const getAllCategories = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const result = await PropertiesServices.getAllCategoriesFromDB();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Categories retrieved successfully",
    data: result,
  });
});

export const PropertiesController = {
getProperties,
getPropertyDetails,
getAllCategories

}
