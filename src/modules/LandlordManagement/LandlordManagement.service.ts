import { Result } from "pg";
import { prisma } from "../../lib/prisma";
import { PropertyPayload } from "./LandlordManagement.interface"




const createProperty = async(payload : PropertyPayload , landlordId : string) => {
  const { title, location, categoryId, description,amenities,price} = payload;

  const createdProperties = await prisma.property.create({
  data: {
    title,
    location,
    description,
    amenities,
    price,
    category: {
      connect: { id: categoryId }
    },
    landlord: {
      connect: { id: landlordId }
    }
  }
});
  return createdProperties;
}


const getPropertyById = async(id : string, data : any)=>{
const result = await prisma.property.update({
  where : {
    id :id,
  },
    data : data,
});
if (!result) {
    throw new Error("Property not found!");
  }

  return result
}

const deleteById = async(id : string)=>{
const deleteProperty = await prisma.property.findUniqueOrThrow({
  where : {
    id : id
  },
  select: {
            id: true
        }
})

const property = await prisma.property.delete({
  where:{
    id : deleteProperty.id
  }
})
return property
}


const getLandlordRequestsFromDB = async (landlordId: string) => {
  const result = await prisma.rentalRequest.findMany({
    where: {
      property: {
        landlordId: landlordId, 
      },
    },
    include: {
      property: true, 
      client: {
        select: {      
          id: true,
          name: true,
          email: true,
          profilePhoto: true,
        },
      },
    },
  });
  return result;
};


const updateRequestStatusInDB = async (requestId: string, status: string, landlordId: string) => {
  
  const requestDetails = await prisma.rentalRequest.findUnique({
    where: { id: requestId },
    include: { property: true },
  });

  if (!requestDetails || requestDetails.property.landlordId !== landlordId) {
    throw new Error("Unauthorized! You do not own this property.");
  }

  
  const result = await prisma.rentalRequest.update({
    where: {
      id: requestId,
    },
    data: {
      status: status as any, 
    },
  });
  return result;
};

export const LandlordManagementServices = {
  createProperty,
  getPropertyById,
  deleteById,
  getLandlordRequestsFromDB,
  updateRequestStatusInDB
}