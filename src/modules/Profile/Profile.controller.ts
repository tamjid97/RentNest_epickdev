import { Request, Response } from "express";
import httpStatus from "http-status";

import { catchAsync } from "../../utils/catchAsync";

import { sendResponse } from "../../utils/sendRespons.";
import { profileServices } from "./Profile.service";

const getMyProfile = catchAsync(async (req: Request & { user?: any }, res: Response) => {
    const userId = req.user?.id as string;

    if (!userId) {
        throw new Error("Unauthorized access");
    }

    const result = await profileServices.getProfileFromDB(userId);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Profile retrieved successfully",
        data: { profile: result },
    });
});

const updateMyProfile = catchAsync(async (req: Request & { user?: any }, res: Response) => {
    const userId = req.user?.id as string;

    if (!userId) {
        throw new Error("Unauthorized access");
    }

    const updateData = req.body;
    const result = await profileServices.updateProfileIntoDB(userId, updateData);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Profile updated successfully",
        data: { profile: result },
    });
});

export const profileController = {
    getMyProfile,
    updateMyProfile,
};