import { prisma } from "../../lib/prisma";

const createReviewIntoDB = async (
    userId: string, 
    payload: { propertyId: string; rating: number; comment: string }
) => {
    const { propertyId, rating, comment } = payload;

    // ১. চেক করা ইউজার সফলভাবে প্রপার্টিটি রেন্ট করেছে কিনা
    const hasValidRental = await prisma.rentalRequest.findFirst({
        where: {
            propertyId,
            clientId: userId, 
            status: {
                in: ["ACTIVE", "COMPLETED"] 
            }
        }
    });

    if (!hasValidRental) {
        throw new Error("You can only review properties that you have successfully rented!");
    }

    // ২. 🌟 ডুপ্লিকেট রিভিউ চেক (একই ইউজার একই প্রপার্টিতে একবারের বেশি রিভিউ দিতে পারবে না)
    const existingReview = await prisma.review.findFirst({
        where: {
            propertyId,
            tenantId: userId,
        },
    });

    if (existingReview) {
        throw new Error("You have already reviewed this property!");
    }

    // ৩. রিভিউ তৈরি করা
    const result = await prisma.review.create({
        data: {
            propertyId,
            rating,
            comment,
            tenantId: userId, 
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