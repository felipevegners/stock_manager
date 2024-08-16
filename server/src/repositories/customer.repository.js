import { prisma } from "../database/index.js";

export const getCustomers = async () => {
  const customers = await prisma.customer.findMany();

  return customers;
};

export const addCustomer = async (data) => {
  const addItem = await prisma.customer.create({ data });

  return addItem;
};

export const updateCustomer = async (data) => {
  const { id } = data.params;
  const {
    name,
    phone,
    email,
    street,
    stNumber,
    stComplement,
    city,
    state,
    zipCode,
    observations
  } = data.body;

  const updatedCustomer = await prisma.customer.update({
    where: {
      id
    },
    data: {
      name,
      phone,
      email,
      street,
      stNumber,
      stComplement,
      city,
      state,
      zipCode,
      observations
    }
  });

  return updatedCustomer;
};

export const deleteCustomer = async (data) => {

  const { id } = data;

  const deletedCustomer = await prisma.customer.delete({
    where: { id }
  });

  return deletedCustomer;
};
