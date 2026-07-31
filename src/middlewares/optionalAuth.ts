import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { Role } from "../../generated/prisma/enums"; // আপনার Role enum এর সঠিক পাথ

// ১. ইউজারের পেলোডের জন্য একটি Interface ডিফাইন করুন
interface CustomJwtPayload {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export const optionalAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies?.accessToken || req.headers.authorization?.split(" ")[1];

    if (token) {
      // 🎯 'as unknown as CustomJwtPayload' দিয়ে টাইপ কাস্টিং করুন
      const verifiedUser = jwt.verify(
        token, 
        process.env.JWT_SECRET as string
      ) as unknown as CustomJwtPayload;

      req.user = verifiedUser; // ✅ এখন আর কোনো Type Error দিবে না
    }
  } catch (error) {
    console.log("Optional Auth: User is guest");
  }

  next();
};