import { prisma } from "../../lib/prisma";

const getPropertiesIntoDB = async (filters: any) => {
  const { location, price, type, categoryId } = filters;
  const where: any = {};

  if (location) {
    where.location = { contains: location, mode: 'insensitive' };
  }

  if (price) {
    where.price = Number(price); 
  }

  if (type) {
    where.type = { contains: type, mode: 'insensitive' };
  }

  if (categoryId) {
    where.categoryId = categoryId;
  }

  return await prisma.property.findMany({
    where,
    include: { category: true, landlord: true }
  });
};

const getPropertyDetailsFromDB = async (id: string, userId?: string) => {
  const property = await prisma.property.findUnique({
    where: { id },
    include: {
      category: true, 
      landlord: {
        select: {    
          id: true,
          name: true,
          email: true,
          role: true,
          profilePhoto: true,
        },
      },
    },
  });

  if (!property) {
    return null;
  }

  let currentUserRequestStatus = null;

if (userId) {
    const rentalRequest = await prisma.rentalRequest.findFirst({
      where: {
        propertyId: id,
        clientId: userId,
      },
      orderBy: {
        createdAt: 'desc', 
      },
    });

    if (rentalRequest) {
      currentUserRequestStatus = rentalRequest.status; 
    }
  }

  return {
    ...property,
    currentUserRequestStatus, 
  };
};

const getAllCategoriesFromDB = async () => {
  const result = await prisma.category.findMany();
  return result;
};

const createPropertyIntoDB = async (payload: any, landlordId: string) => {
  const result = await prisma.property.create({
    data: {
      title: String(payload.title),
      description: payload.description ? String(payload.description) : null,
      location: String(payload.location),
      price: Number(payload.price), 
      amenities: Array.isArray(payload.amenities) ? payload.amenities : [],
      image: payload.image || null,
      isAvailable: payload.isAvailable || "AVAILABLE", 
      categoryId: String(payload.categoryId),
      landlordId: String(landlordId), 
    },
  });
  return result;
};

const updatePropertyInDB = async (id: string, payload: any, landlordId: string) => {
  const isExist = await prisma.property.findUnique({ where: { id } });

  if (!isExist) {
    throw new Error("Property not found!");
  }

  if (isExist.landlordId !== landlordId) {
    throw new Error("You are not authorized to update this property!");
  }

  const result = await prisma.property.update({
    where: { id },
    data: {
      title: String(payload.title),
      description: payload.description ? String(payload.description) : null,
      location: String(payload.location),
      price: Number(payload.price),
      amenities: Array.isArray(payload.amenities) ? payload.amenities : [],
      image: payload.image || null,
      isAvailable: payload.isAvailable,
      categoryId: String(payload.categoryId),
    },
  });
  return result;
};

const deletePropertyFromDB = async (id: string, landlordId: string) => {
  const isExist = await prisma.property.findUnique({ where: { id } });

  if (!isExist) {
    throw new Error("Property not found!");
  }

  if (isExist.landlordId !== landlordId) {
    throw new Error("You are not authorized to delete this property!");
  }

  const result = await prisma.property.delete({ where: { id } });
  return result;
};

export const PropertiesServices = {
  getPropertiesIntoDB,
  getAllCategoriesFromDB,
  getPropertyDetailsFromDB,
  createPropertyIntoDB,
  updatePropertyInDB,
  deletePropertyFromDB,
};