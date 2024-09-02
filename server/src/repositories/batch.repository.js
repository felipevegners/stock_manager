import { prisma } from "../database/index.js";

export const getBatches = async (data) => {
  const { id } = data;

  if (Object.keys(data).length) {
    const batches = await prisma.batch.findMany({
      where: {
        id
      }
    });

    return batches;
  } else {
    const batches = await prisma.batch.findMany();
    return batches;
  }
};

export const createBatch = async (data) => {
  const addBatch = await prisma.batch.create({ data });

  return addBatch;
};

export const updateBatch = async (data) => {
  const { id } = data.params;
  const {
    batchName,
    batchDate,
    batchQty,
    batchTax,
    batchFreight,
    batchBoyPrice
  } = data.body;

  const updatedBatch = await prisma.batch.update({
    where: {
      id
    },
    data: {
      batchName,
      batchDate,
      batchQty,
      batchTax,
      batchFreight,
      batchBoyPrice
    }
  });

  return updatedBatch;
};

export const deleteBatch = async (data) => {
  const { id } = data;

  const deletedBatch = await prisma.batch.delete({
    where: { id }
  });

  return deletedBatch;
};
