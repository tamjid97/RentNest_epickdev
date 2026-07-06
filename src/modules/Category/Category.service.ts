
import { prisma } from "../../lib/prisma";
import { CategoryPayload } from "./Category.interface";


const createCategory = async (payload: CategoryPayload) => {
  return await prisma.category.create({
    data: payload,
  });
};

const getAllCategories = async () => {
  return await prisma.category.findMany();
};

export const CategoryService = {
  createCategory,
  getAllCategories,
};