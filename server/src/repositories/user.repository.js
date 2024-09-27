import { prisma } from "../database/index.js";
import bcrypt from "bcrypt";

export const getUser = async (data) => {
  if (Object.keys(data).length) {
    const user = await prisma.user.findUnique({
      where: {
        email: data
      }
    });

    return user;
  } else {
    const user = await prisma.user.findMany();
    return user;
  }
};

export const registerUser = async (data) => {
  const { name, email, password, roles } = data;

  const salt = await bcrypt.genSalt(12);
  const passwordHash = await bcrypt.hash(password, salt);

  const userData = {
    name: name,
    email: email,
    password: passwordHash,
    roles: roles
  };

  const addUser = await prisma.user.create({ data: userData });

  return addUser;
};

export const updateUserRoles = async (data) => {
  const { id } = data.params;
  const { roles } = data.body;

  const updatedUser = await prisma.user.update({
    where: { id },
    data: {
      roles: roles
    }
  });

  return updatedUser;
};

export const deleteUser = async (data) => {
  const { id } = data;

  const deletedUser = await prisma.user.delete({
    where: { id }
  });

  return deletedUser;
};
