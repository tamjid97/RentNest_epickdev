import { prisma } from "../../lib/prisma";
import { PropertyPayload } from "./LandlordManagement.interface";

const createProperty = async (payload: any, landlordId: string) => {
  const { title, location, categoryId, description, amenities, price, image, isAvailable } = payload;

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
      ...(isAvailable && { isAvailable: isAvailable }),
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
    where: { landlordId: landlordId },
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });
  return result;
};

// 🟢 ফিক্স: UNAVAILABLE (রেন্টেড/এপ্রুভড) প্রপার্টি যেন আপডেট করা না যায়
const getPropertyById = async (id: string, data: any) => {
  const existingProperty = await prisma.property.findUnique({
    where: { id: id }
  });

  if (!existingProperty) {
    throw new Error("Property not found!");
  }

  // 🟢 এখানে RENTED এর বদলে তোমার এনাম অনুযায়ী UNAVAILABLE দেওয়া হলো
  if (existingProperty.isAvailable === "UNAVAILABLE") {
    throw new Error("You cannot update an approved or rented property!");
  }

  const result = await prisma.property.update({
    where: { id: id },
    data: data,
  });

  return result;
};

const deleteById = async (id: string) => {
  const deleteProperty = await prisma.property.findUniqueOrThrow({
    where: { id: id },
    select: { id: true }
  });

  const property = await prisma.property.delete({
    where: { id: deleteProperty.id }
  });
  return property;
};

const getLandlordRequestsFromDB = async (landlordId: string) => {
  const result = await prisma.rentalRequest.findMany({
    where: {
      property: { landlordId: landlordId },
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

// 🟢 ফিক্স: একাধিক এপ্রুভ বন্ধ করা এবং প্রপার্টি স্ট্যাটাস UNAVAILABLE করা
const updateRequestStatusInDB = async (requestId: string, status: string, landlordId: string) => {
  const requestDetails = await prisma.rentalRequest.findUnique({
    where: { id: requestId },
    include: { property: true },
  });

  if (!requestDetails || requestDetails.property.landlordId !== landlordId) {
    throw new Error("Unauthorized! You do not own this property.");
  }

  // যদি ল্যান্ডলর্ড রিকোয়েস্ট "APPROVED" করে, তাহলে ট্রানজ্যাকশন চালাবো
  if (status === "APPROVED") {
    const [updatedRequest, rejectedOthers, updatedProperty] = await prisma.$transaction([
      // ১. সিলেক্টেড রিকোয়েস্ট APPROVED করা
      prisma.rentalRequest.update({
        where: { id: requestId },
        data: { status: "APPROVED" },
      }),
      // ২. একই প্রপার্টির অন্য সব PENDING রিকোয়েস্ট REJECTED করা
      prisma.rentalRequest.updateMany({
        where: {
          propertyId: requestDetails.propertyId,
          id: { not: requestId }, // এই রিকোয়েস্ট বাদে বাকিগুলো
          status: "PENDING",
        },
        data: { status: "REJECTED" },
      }),
      // ৩. 🟢 প্রপার্টির স্ট্যাটাস UNAVAILABLE করে দেওয়া
      prisma.property.update({
        where: { id: requestDetails.propertyId },
        data: { isAvailable: "UNAVAILABLE" },
      })
    ]);
    
    return updatedRequest;
  } 
  
  // আর যদি রিজেক্ট বা অন্য কোনো স্ট্যাটাস হয়, তাহলে নরমাল আপডেট হবে
  const result = await prisma.rentalRequest.update({
    where: { id: requestId },
    data: { status: status as any }, // Request থেকে আসা status টাইপ কাস্টিংয়ের জন্য as any রাখা হলো
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