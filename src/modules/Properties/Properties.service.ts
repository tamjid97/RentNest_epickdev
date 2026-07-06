import { prisma } from "../../lib/prisma";
import { PropertyPayload } from "./Properties.interface";

const getPropertiesIntoDB = async () => {
  

  const createdProperties = await prisma.property.findMany({
    
  })
  return createdProperties;
};

export const PropertiesServices = {
  getPropertiesIntoDB,
};
