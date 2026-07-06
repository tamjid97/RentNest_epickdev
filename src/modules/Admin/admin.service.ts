import { prisma } from "../../lib/prisma";



const getAllUsers = async () => {
  const result = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      activeStatus: true, 
      createdAt: true,
      updatedAt: true,
    },
    orderBy: {
      createdAt: "desc", 
    },
  });
  return result;
};


const updateUserStatus = async (id: string, status: string) => {
  
  const isUserExist = await prisma.user.findUnique({
    where: { id },
  });

  if (!isUserExist) {
    throw new Error("User not found!");
  }

  const result = await prisma.user.update({
    where: { id },
    data: {
      status: status, 
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
    },
  });
  return result;
};


const getAllProperties = async () => {
  const result = await prisma.property.findMany({
    include: {
      category: {
        select: {
          name: true,
        },
      },
      landlord: {
        select: {
          name: true,
          email: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return result;
};


const getAllRentals = async () => {
  const result = await prisma.rentalRequest.findMany({
    include: {
      property: {
        select: {
          title: true,
          location: true,
        },
      },
      client: {
        select: {
          name: true,
          email: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return result;
};

export const AdminManagementService = {
  getAllUsers,
  updateUserStatus,
  getAllProperties,
  getAllRentals,
};