import { prisma } from "../../lib/prisma";
import { PropertyPayload } from "./LandlordManagement.interface";



const createProperty = async (payload: any, landlordId: string) => {
  const { title, location, categoryId, description, amenities, price, image, isAvailable } = payload;

  // ভ্যালিডেশন ও টাইপ কনভার্শন নিশ্চিত করা
  const parsedPrice = price !== undefined && price !== null && price !== "" ? Number(price) : null;
  const parsedAmenities = Array.isArray(amenities) ? amenities.map(String) : [];

  if (!categoryId) {
    throw new Error("Category ID is required!");
  }

  const createdProperties = await prisma.property.create({
    data: {
      title: String(title),
      location: String(location),
      description: description ? String(description) : null,
      price: parsedPrice,
      amenities: parsedAmenities,
      image: image ? String(image) : null,
      ...(isAvailable && { isAvailable: isAvailable as any }),
      category: {
        connect: { id: String(categoryId) }
      },
      landlord: {
        connect: { id: String(landlordId) }
      }
    }
  });
  
  return createdProperties;
};


const getLandlordPropertiesFromDB = async (landlordId: string) => {
  const result = await prisma.property.findMany({
    where: {
      landlordId: landlordId,
    },
    include: {
      category: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return result;
};

const getPropertyById = async (id: string, data: any) => {
  const result = await prisma.property.update({
    where: {
      id: id,
    },
    data: data,
  });
  
  if (!result) {
    throw new Error("Property not found!");
  }

  return result;
};

const deleteById = async (id: string) => {
  const deleteProperty = await prisma.property.findUniqueOrThrow({
    where: {
      id: id
    },
    select: {
      id: true
    }
  });

  const property = await prisma.property.delete({
    where: {
      id: deleteProperty.id
    }
  });
  return property;
};

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
  getLandlordPropertiesFromDB,
  getPropertyById,
  deleteById,
  getLandlordRequestsFromDB,
  updateRequestStatusInDB
};