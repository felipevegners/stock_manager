import API from "../services/api";

const getUsers = async () => {
  try {
    const { data } = await API.get("/user");
    return data;
  } catch (error) {
    return error;
  }
};

const userLogin = async (email, password) => {
  try {
    const { data } = await API.post("/user/login", {
      email: email,
      password: password
    });
    return data;
  } catch (error) {
    return error;
  }
};

const userRegister = async (userData) => {
  try {
    const { data } = await API.post("user/register", userData);
    return data;
  } catch (error) {
    return error.message;
  }
};

const updateUserRoles = async (id, userRoles) => {
  try {
    const { data } = await API.put(`user/${id}`, userRoles);
    return data;
  } catch (error) {
    return error;
  }
};

const deleteUser = async (userId) => {
  try {
    const { data } = await API.delete(`user/${userId}`);
    return data;
  } catch (error) {
    return error;
  }
};

export { getUsers, userLogin, userRegister, updateUserRoles, deleteUser };
