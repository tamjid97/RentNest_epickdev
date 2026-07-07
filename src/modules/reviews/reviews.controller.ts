import { Request, Response } from "express";


import httpStatus from "http-status";
import { sendResponse } from "../../utils/sendRespons.";
import { catchAsync } from "../../utils/catchAsync";
import { reviewServices } from "./reviews.service";


const createReview = catchAsync(async (req: Request, res: Response) => {

    const user = req.user as any; 
    

    if (!user) {
        throw new Error("Unauthorized access");
    }

    const reviewData = req.body;
    const result = await reviewServices.createReviewIntoDB(user.userId, reviewData);

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