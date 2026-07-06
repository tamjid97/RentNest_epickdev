import { Result } from "pg";
import { prisma } from "../../lib/prisma";
import { PropertyPayload } from "./LandlordManagement.interface"




const createProperty = async(payload : PropertyPayload , landlordId : string) => {
  const { title, location, categoryId, description,amenities} = payload;

  const createdProperties = await prisma.property.create({
  data: {
    title,
    location,
    description,
    amenities,
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

export const LandlordManagementServices = {
  createProperty,
  getPropertyById,
  deleteById
}