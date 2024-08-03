import { getStock, addStockItem } from "../repositories/stock.repository.js"

export const index = async (req, res) => {

  try {
    const stockItems = await getStock(req.params);
    res.status(200).send(stockItems);

  } catch (err) {
    res.status(400).send(err);
  }

};

export const create = async (req, res) => {

  try {
    const item = await addStockItem(req.body);
    res.status(200).send(item);

  } catch (err) {
    res.status(400).send(err);
  }

};
