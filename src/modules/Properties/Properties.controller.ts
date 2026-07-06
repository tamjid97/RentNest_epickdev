// import { NextFunction, Request, Response } from "express";
// import { catchAsync } from "../../utils/catchAsync";
// import { PropertiesServices } from "./Properties.service";
// import { sendResponse } from "../../utils/sendRespons.";
// import  httpStatus  from "http-status";



// const getProperties = catchAsync(async(req: Request, res: Response, next: NextFunction)=>{
// const payload = req.body
// const properties = await PropertiesServices.getPropertiesIntoDB(payload);

// sendResponse(res, {
//       success: true,
//       statusCode: httpStatus.CREATED,
//       message: "User registered successfully",
//       data: properties
//     });
// })


// export const PropertiesController = {
// getProperties,
// }
