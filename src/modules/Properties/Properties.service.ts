// import { prisma } from "../../lib/prisma";
// import { PropertyPayload } from "./Properties.interface";

// const getPropertiesIntoDB = async (payload: PropertyPayload) => {
//   const { title, location, categoryId, description, amenities } = payload;

//   const createdProperties = await prisma.property.create({
//     data : {
//       title, location, categoryId, description, 
//     }
//   })
//   return createdProperties;
// };

// export const PropertiesServices = {
//   getPropertiesIntoDB,
// };
