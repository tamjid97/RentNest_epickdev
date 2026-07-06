import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendRespons.";
import { RentalRequestServices } from "./rentalRequests.service";
import httpStatus  from "http-status";

const postRentalRequest = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  
  const clientId = req.user?.id;
  
  if (!clientId) {
    
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  const result = await RentalRequestServices.postRentalRequestIntoDB(req.body, clientId);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Rental request submitted successfully",
    data: result,
  });
});


const getRentalRequest = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  
  const clientId = req.user?.id;

  if (!clientId) {
    throw new Error("User not authorized");
  }

  
  const result = await RentalRequestServices.getRentalRequestIntoDB(clientId);

  
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Rental requests retrieved successfully",
    data: result,
  });
});

const getRentalRequestDetails = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params; 

  const result = await RentalRequestServices.getRentalRequestDetailsIntoDB(id as string);

  if (!result) {
    return res.status(404).json({
      success: false,
      message: "Rental request not found!",
    });
  }

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Rental request details retrieved successfully",
    data: result,
  });
});

export const RentalRequestController = {
  postRentalRequest,
  getRentalRequest,
  getRentalRequestDetails
}