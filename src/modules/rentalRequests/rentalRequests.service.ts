import { RentalRequest } from "../../../generated/prisma/browser"
import { prisma } from "../../lib/prisma";



const postRentalRequestIntoDB = async (payload: any, clientId: string) => {
  console.log("সার্ভিস ফাংশন শুরু হয়েছে..."); // এটি আসে কি না দেখো
  
  const { propertyId, rentStartDate, rentEndDate } = payload;
  
  try {
    const result = await prisma.rentalRequest.create({
      data: {
        propertyId,
        clientId,
        rentStartDate: new Date(rentStartDate),
        rentEndDate: new Date(rentEndDate),
      },
    });
    console.log("ডাটাবেসে সেভ হয়েছে:", result); // এটি আসে কি না দেখো
    return result;
  } catch (error) {
    console.error("ডাটাবেস এরর:", error); // যদি এরর থাকে তবে এখানে ধরা পড়বে
    throw error;
  }
};


const getRentalRequestIntoDB = async()=>{

}
const getRentalRequestDetailsIntoDB = async()=>{

}

export const RentalRequestServices = {
postRentalRequestIntoDB,
getRentalRequestDetailsIntoDB,
getRentalRequestIntoDB
}