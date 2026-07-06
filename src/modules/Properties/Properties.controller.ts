import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { PropertiesServices } from "./Properties.service";
import { sendResponse } from "../../utils/sendRespons.";
import  httpStatus  from "http-status";



const getProperties = catchAsync(async(req: Request, res: Response, next: NextFunction)=>{

const properties = await PropertiesServices.getPropertiesIntoDB();

sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Properties retrieved successfully",
      data: properties
    });
})


export const PropertiesController = {
getProperties,
}
