import { catchAsync } from "../../utils/catchAsync";
import httpStatus from "http-status";
import { sendResponse } from "../../utils/sendRespons.";
import { NextFunction, Request, Response } from "express";
import { LandlordManagementServices } from "./LandlordManagement.service";

const createPropertyIntoDB = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;

    const landlordId = req.user?.id;

    if (!landlordId) {
      throw new Error("You are not logged in properly.");
    }

    const properties = await LandlordManagementServices.createProperty(
      payload,
      landlordId,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Property Created successfully",
      data: properties,
    });
  },
);

const getPropertyByIdIntoDB = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const payload = req.body;

    const result = await LandlordManagementServices.getPropertyById(
      id as string,
      payload,
    );
    return sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Property updated successfully",
      data: result,
    });
  },
);

const deleteByIdIntoDB = catchAsync(async(req: Request, res: Response, next: NextFunction)=>{


  const {id} = req.params

  const result = await LandlordManagementServices.deleteById(id as string);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Property deleted successfully",
    data: result,
  });
});


export const LandlordManagementController = {
  createPropertyIntoDB,
  getPropertyByIdIntoDB,
  deleteByIdIntoDB,
};
