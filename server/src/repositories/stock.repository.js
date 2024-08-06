import { prisma } from "../database/index.js";

export const getStock = async (data) => {
  const {
    imei,
    model,
    color,
    capacity,
    status,
    condition,
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
            status: {
              contains: status,
              mode: "insensitive"
            }
          },
          {
            condition: {
              contains: condition,
              mode: "insensitive"
            }
          },
          {
            condition: {
              contains: isAvailable,
              mode: "insensitive"
            }
          },
          {
            condition: {
              contains: createdAt,
              mode: "insensitive"
            }
          },
          {
            condition: {
              contains: updatedAt,
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
    model,
    color,
    capacity,
    condition,
    qty,
    unitPrice,
    tax,
    status,
    isAvailable
  } = data.body;

  const updatedItem = await prisma.item.update({
    where: {
      id
    },
    data: {
      model,
      color,
      capacity,
      condition,
      qty,
      unitPrice,
      tax,
      status,
      isAvailable
    }
  });

  return updatedItem;
};

export const deleteStockItem = async (data) => {

  const {id} = data

  const deletedItem = await prisma.item.delete({
    where: { id }
  });

  return deletedItem;
};
