import { prisma } from "../database/index.js";

export const getStock = async (data) => {
  const {
    batch,
    imei,
    model,
    color,
    capacity,
    battery,
    details,
    status,
    isAvailable,
    createdAt,
    updatedAt
  } = data;

  if (Object.keys(data).length) {
    const stockItems = await prisma.item.findMany({
      where: {
        AND: [
          {
            imei: {
              contains: imei
            }
          },
          {
            model: {
              contains: model,
              mode: "insensitive"
            }
          },
          {
            color: {
              contains: color,
              mode: "insensitive"
            }
          },
          {
            capacity: {
              contains: capacity,
              mode: "insensitive"
            }
          },
          {
            battery: {
              contains: battery,
              mode: "insensitive"
            }
          },
          {
            status: {
              contains: status,
              mode: "insensitive"
            }
          }
        ]
      }
    });

    return stockItems;
  } else {
    const stockItems = await prisma.item.findMany();
    return stockItems;
  }
};

export const addStockItem = async (data) => {
  const addItem = await prisma.item.create({ data });

  return addItem;
};

export const updateStockItem = async (data) => {
  const { id } = data.params;
  const {
    batch,
    model,
    color,
    capacity,
    battery,
    details,
    itemCosts,
    totalCosts,
    status,
    isAvailable
  } = data.body;

  const updatedItem = await prisma.item.update({
    where: {
      id
    },
    data: {
      batch,
      model,
      color,
      capacity,
      battery,
      details,
      itemCosts,
      totalCosts,
      status,
      isAvailable
    }
  });

  return updatedItem;
};

export const deleteStockItem = async (data) => {
  const { id } = data;

  const deletedItem = await prisma.item.delete({
    where: { id }
  });

  return deletedItem;
};
