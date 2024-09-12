import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategories
} from "../repositories/categories.repository.js";

export const index = async (req, res) => {
  try {
    const categories = await getCategories(req.query);
    res.status(200).json(categories);
  } catch (err) {
    res.status(400).send(err);
  }
};

export const create = async (req, res) => {
  try {
    const category = await createCategory(req.body);
    res
      .status(200)
      .json({ message: "Categoria cadastrada com sucesso!", category });
  } catch (err) {
    res.status(400).send(err);
    console.log(err);
  }
};

export const update = async (req, res) => {
  try {
    const category = await updateCategory(req);
    res.status(201).json({
      message: "Categorias atualizadas com sucesso!",
      category
    });
  } catch (err) {
    res.status(400).send(err);
  }
};

export const remove = async (req, res) => {
  try {
    const category = await deleteCategories(req.params);
    res
      .status(200)
      .json({ message: "Categoria removida com sucesso!", category });
  } catch (err) {
    res.status(400).send(err);
  }
};
