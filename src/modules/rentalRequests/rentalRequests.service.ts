import { RentalRequest } from "../../../generated/prisma/browser"
import { prisma } from "../../lib/prisma";



const postRentalRequestIntoDB = async (payload: any, clientId: string) => {
  
  
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
    
    return result;
  } catch (error) {
    
    throw error;
  }
};

const getRentalRequestIntoDB = async (clientId: string) => {
  const result = await prisma.rentalRequest.findMany({
    where: {
      clientId: clientId,
    },
    include: {
      property: {
        include: {
          landlord: { // আপনার Prisma Schema-তে Landlord রিলেশনের নাম যদি 'landlord' হয়
            select: {
              id: true,
              name: true,
              email: true,
              phone: true, // আপনার প্রয়োজন অনুযায়ী ফিল্ডগুলো সিলেক্ট করতে পারেন
            },
          },
        },
      },
    },
  });
  return result;
};

const getRentalRequestDetailsIntoDB = async (id: string) => {
  const result = await prisma.rentalRequest.findUnique({
    where: { id },
    include: {
      property: true, 
      client: {
        omit: { password: true } 
      },   
    },
  });
  return result;
};

export const RentalRequestServices = {
postRentalRequestIntoDB,
getRentalRequestDetailsIntoDB,
getRentalRequestIntoDB
}