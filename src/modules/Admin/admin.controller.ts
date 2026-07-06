import { Request, Response } from "express";
import httpStatus from "http-status"; 
import { sendResponse } from "../../utils/sendRespons."; 
import { AdminManagementService } from "./admin.service";
import { catchAsync } from "../../utils/catchAsync";


const getAllUsersFromDB = catchAsync(async (req: Request, res: Response) => {
  const result = await AdminManagementService.getAllUsers();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Users retrieved successfully",
    data: result,
  });
});


const updateUserStatusIntoDB = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body; 

  const result = await AdminManagementService.updateUserStatus(id as string, status);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User status updated successfully",
    data: result,
  });
});


const getAllPropertiesFromDB = catchAsync(async (req: Request, res: Response) => {
  const result = await AdminManagementService.getAllProperties();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Properties retrieved successfully",
    data: result,
  });
});


const getAllRentalsFromDB = catchAsync(async (req: Request, res: Response) => {
  const result = await AdminManagementService.getAllRentals();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK, 
    message: "Rental requests retrieved successfully",
    data: result,
  });
});

export const AdminManagementController = {
  getAllUsersFromDB,
  updateUserStatusIntoDB,
  getAllPropertiesFromDB,
  getAllRentalsFromDB,
};