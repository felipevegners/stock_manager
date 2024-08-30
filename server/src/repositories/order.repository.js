import { prisma } from "../database/index.js";

export const getOrders = async (data) => {
  const { id } = data
  const orders = await prisma.order.findMany({
    where: {
      id
    }
  });

  return orders;
};

export const createOrder = async data => {
  const addOrder = await prisma.order.create({ data });

  return addOrder;
};

export const updateOrder = async data => {
  const { id } = data.params;
  const {
    orderNum,
    orderDate,
    customer,
    items,
    shipping,
    orderValue,
    payment,
    status,
    observations,
    isDraft
  } = data.body;

  const updatedOrder = await prisma.order.update({
    where: {
      id
    },
    data: {
      orderNum,
      orderDate,
      customer,
      items,
      shipping,
      orderValue,
      payment,
      status,
      observations,
      isDraft
    }
  });

  return updatedOrder;
};

export const cancelOrder = async (data) => {

  const { id } = data;

  const status = "Cancelado"

  const canceledOrder = await prisma.order.update({
    where: { id }, data: {status}
  });

  return canceledOrder;
};

export const removeOrder = async (data) => {

  const { id } = data;

  const deletedOrder = await prisma.order.delete({
    where: { id }
  });

  return deletedOrder;
};
