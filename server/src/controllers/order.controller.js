import {
  getOrders,
  createOrder,
  updateOrder,
  cancelOrder,
  removeOrder
} from "../repositories/order.repository.js";

export const index = async (req, res) => {
  try {
    const orders = await getOrders(req.query);
    res.status(200).json(orders);
  } catch (err) {
    res.status(400).send(err);
  }
};

export const create = async (req, res) => {
  try {
    const order = await createOrder(req.body);
    res.status(200).json({ message: "Pedido criado com sucesso!", order });
  } catch (err) {
    console.log (err)
    res.status(400).send(err);
  }
};

export const update = async (req, res) => {
  try {
    const order = await updateOrder(req);
    res.status(201).json({ message: "Pedido atualizado com sucesso!", order });
  } catch (err) {
    res.status(400).send(err);
  }
};

export const cancel = async (req, res) => {
    try {
        const order = await cancelOrder(req.params);
        res.status(200).json({ message: "Pedido cancelado com sucesso!", order})
    } catch (err) {
        res.status(400).send(err);
        
    }
}

export const remove = async (req, res) => {
  try {
    const order = await removeOrder(req.params);
    res.status(200).json({ message: "Pedido removido com sucesso!", order });
    
  } catch (err) {
    res.status(400).send(err);
  }
}