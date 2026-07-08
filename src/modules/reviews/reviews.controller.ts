import { Request, Response } from "express";
import httpStatus from "http-status";

import { catchAsync } from "../../utils/catchAsync";
import { reviewServices } from "./reviews.service";
import { sendResponse } from "../../utils/sendRespons.";

const createReview = catchAsync(async (req: Request, res: Response) => {
    const tenantId = req.user?.id as string; 
    
    if (!tenantId) {
        throw new Error("Unauthorized access");
    }

    const reviewData = req.body;
    const result = await reviewServices.createReviewIntoDB(tenantId, reviewData);

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Review created successfully",
        data: result,
    });
});

export const reviewController = {
    createReview,
};