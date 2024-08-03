import { prisma } from "../database/index.js";

export const getStock = async (data) => {

    const { imei, model, color, capacity, status, condition } = data;

    if (Object.keys(data).length) {
      const stockItems = await prisma.item.findMany({
        where: {
          OR: [
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
              capacity: parseInt(capacity)
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
            }
          ]
        }
      });
      return stockItems;

    } else {
      const stockItems = await prisma.item.findMany();
      return stockItems;
    }
}

export const addStockItem = async (data) => {

  const addItem = await prisma.item.create({ data });

  return addItem;
}
