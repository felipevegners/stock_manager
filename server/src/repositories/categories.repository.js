import { prisma } from "../database/index.js";

export const getCategories = async (data) => {
  const { name, type } = data;

  if (Object.keys(data).length) {
    const categories = await prisma.categories.findMany({
      where: {
        type,
        name
      }
    });

    return categories;
  } else {
    const categories = await prisma.categories.findMany();
    return categories;
  }
};

export const createCategory = async (data) => {
  const addCategory = await prisma.categories.create({ data });

  return addCategory;
};

export const updateCategory = async (data) => {
  const { id } = data.params;
  const { name, content } = data.body;

  const updatedCategories = await prisma.categories.update({
    where: {
      id
    },
    data: {
      name,
      content
    }
  });

  return updatedCategories;
};

export const deleteCategories = async (data) => {
  const { id } = data;

  const deletedCategory = await prisma.categories.delete({
    where: { id }
  });

  return deletedCategory;
};
