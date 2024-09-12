import API from "../services/api";

const getCategories = async (searchParams) => {
  try {
    const { data } = await API.get("/categories", {
      params: searchParams ? searchParams : {}
    });
    return data;
  } catch (error) {
    return error.message;
  }
};

const createCategory = async (categoriesData) => {
  try {
    const { data } = await API.post("/categories", categoriesData);
    return data;
  } catch (error) {
    return error;
  }
};

const updateCategories = async (id, newCategoryData) => {
  try {
    const { data } = await API.put(`categories/${id}`, newCategoryData);
    return data;
  } catch (error) {
    return error;
  }
};

const deleteCategory = async (categoryId) => {
  try {
    const { data } = await API.delete(`categories/${categoryId}`);
    return data;
  } catch (error) {
    return error;
  }
};

export { getCategories, createCategory, updateCategories, deleteCategory };
