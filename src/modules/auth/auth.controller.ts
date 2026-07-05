import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendRespons.";
import httpStatus  from "http-status";
import { authService } from "./auth.service";

const createRegisterUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;
    const user = await authService.registerUserIntoDB(payload);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "User registered successfully",
      data: {
        user,
      },
    });
  },
);

export const AuthController = {
  createRegisterUser,
};
