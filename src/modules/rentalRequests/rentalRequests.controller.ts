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


const getRentalRequest = catchAsync(async(req: Request, res: Response, next: NextFunction)=>{

})

const getRentalRequestDetails = catchAsync(async(req: Request, res: Response, next: NextFunction)=>{

})

export const RentalRequestController = {
  postRentalRequest,
  getRentalRequest,
  getRentalRequestDetails
}