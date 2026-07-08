import { prisma } from "../../lib/prisma";

const createReviewIntoDB = async (
    userId: string, 
    payload: { propertyId: string; rating: number; comment: string }
) => {
    const { propertyId, rating, comment } = payload;

    // চেক করা হচ্ছে Tenant আসলেই প্রপার্টিটা ভাড়া নিয়েছে কি না
    const hasValidRental = await prisma.rentalRequest.findFirst({
        where: {
            propertyId,
            tenantId: userId, 
            status: "APPROVED" 
        }
    });

    if (!hasValidRental) {
        throw new Error("You can only review properties that you have successfully rented!");
    }

    // ডাটাবেসে রিভিউ ক্রিয়েট করা
    const result = await prisma.review.create({
        data: {
            propertyId,
            rating,
            comment,
            tenantId: userId, // ✅ ফিক্স: payload.tenantId এর বদলে userId ব্যবহার করা হয়েছে
        },
        include: {
            property: true,
        }
    });

    return result;
};

export const reviewServices = {
    createReviewIntoDB,
};