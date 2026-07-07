import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { paymentServices } from "./payments.service";
import { sendResponse } from "../../utils/sendRespons.";


const createCheckoutSession = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const { rentalRequestId } = req.body; 

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
        // express.raw থাকার কারণে এখন req.body সরাসরি Buffer হিসেবে আসবে
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

const getAllPayments = catchAsync(async (req: Request, res: Response) => {
    const user = req.user; 
    const result = await paymentServices.getAllPaymentsFromDB(user);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Payment history retrieved successfully",
        data: result,
    });
});

const getPaymentById = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const user = req.user;
    const result = await paymentServices.getPaymentByIdFromDB(id as string, user);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Payment details retrieved successfully",
        data: result,
    });
});

export const paymentController = {
    createCheckoutSession,
    handleWebhook,
    getAllPayments,
    getPaymentById
};