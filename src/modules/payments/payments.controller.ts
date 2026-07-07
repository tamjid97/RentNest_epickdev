import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";

import { paymentServices } from "./payments.service";
import { sendResponse } from "../../utils/sendRespons.";

const createCheckoutSession = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const { rentalRequestId } = req.body; // বডি থেকে রেন্টাল রিকোয়েস্ট আইডি আসবে

        const result = await paymentServices.createCheckoutSession(rentalRequestId);

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "Payment session created successfully",
            data: result
        });
    }
);

const handleWebhook = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const event = req.body as Buffer;
        const signature = req.headers['stripe-signature']!;

        await paymentServices.handleWebhook(event, signature as string);

        sendResponse(res, {
            success: true,
            statusCode: 200,
            message: "Webhook triggered successfully",
            data: null
        });
    }
);

export const paymentController = {
    createCheckoutSession,
    handleWebhook
};