import { getStock, addStockItem, updateStockItem, deleteStockItem } from "../repositories/stock.repository.js"

export const index = async (req, res) => {

  try {
    const stockItems = await getStock(req.query);
    res.status(200).json(stockItems);

  } catch (err) {
    console.log(err);
    res.status(400).send(err);
  }

};

export const create = async (req, res) => {

  try {
    const item = await addStockItem(req.body);
    res.status(200).json({message: "Produto adicionado com sucesso!", item})

  } catch (err) {
    res.status(400).send(err);
  }

};

export const update = async (req, res) => {

  try {
    const item = await updateStockItem(req);
    res.status(201).json({message: "Produto atualizado com sucesso!", item});

  } catch (err) {
    res.status(400).send(err);
  }

};

export const remove = async (req, res) => {
  try {
    const item = await deleteStockItem(req.params);
    res.status(200).json({ message: "Produto removido do Estoque!", item });
    
  } catch (err) {
    console.log("err --> ", err)
    res.status(400).send(err);
  }
}
