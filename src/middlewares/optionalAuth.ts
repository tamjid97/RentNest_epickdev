import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { Role } from "../../generated/prisma/enums";

interface CustomJwtPayload {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export const optionalAuth = (req: Request, res: Response, next: NextFunction) => {
  try {
    // ১. কুকি বা হেডার থেকে টোকেন চেক
    const token = req.cookies?.accessToken || req.headers.authorization?.split(" ")[1];

    if (!token) {
      req.user = undefined;
      return next(); // 👈 টোকেন না থাকলে সরাসরি পরবর্তী ধাপে পাঠিয়ে দিন
    }

    // ২. টোকেন থাকলে তা ভেরিফাই করুন
    const secret = process.env.JWT_ACCESS_SECRET || process.env.JWT_SECRET || "your_jwt_secret"; // ব্যাকআপ সিক্রেট
    const verifiedUser = jwt.verify(token, secret) as unknown as CustomJwtPayload;

    req.user = verifiedUser;
  } catch (error) {
    // ⚠️ টোকেন Expired বা Invalid হলেও গেস্ট ইউজার হিসেবে ট্রিট করা হবে
    console.log("Optional Auth: Token invalid or expired, treating as guest");
    req.user = undefined;
  }

  next();
};