import { getCustomers, addCustomer, updateCustomer, deleteCustomer } from "../repositories/customer.repository.js"

export const index = async (req, res) => {

  try {
    const customers = await getCustomers(req.query);
    res.status(200).json(customers);

  } catch (err) {
    console.log(err);
    res.status(400).send(err);
  }

};

export const create = async (req, res) => {

  try {
    const item = await addCustomer(req.body);
    res.status(200).json({message: "Cliente cadastrado com sucesso!", item})

  } catch (err) {
    res.status(400).send(err);
  }

};

export const update = async (req, res) => {

  try {
    const item = await updateCustomer(req);
    res.status(201).json({message: `Cadastro do cliente ${item.name} atualizado com sucesso!`, item});

  } catch (err) {
    res.status(400).send(err);
  }

};

export const remove = async (req, res) => {
  try {
    const item = await deleteCustomer(req.params);
    res.status(200).json({ message: "Cadastro removido com sucesso!", item });
    
  } catch (err) {
    console.log("err --> ", err)
    res.status(400).send(err);
  }
}
