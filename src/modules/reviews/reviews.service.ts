import { prisma } from "../../lib/prisma";

const createReviewIntoDB = async (
    userId: string, 
    payload: { propertyId: string; rating: number; comment: string }
) => {
    const { propertyId, rating, comment } = payload;


    const hasValidRental = await prisma.rentalRequest.findFirst({
        where: {
            propertyId,
            clientId: userId, 
            status: "APPROVED" 
        }
    });

    if (!hasValidRental) {
        throw new Error("You can only review properties that you have successfully rented!");
    }


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