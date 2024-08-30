import { getCustomers, addCustomer, updateCustomer, deleteCustomer } from "../repositories/customer.repository.js"

export const index = async (req, res) => {

  try {
    const customers = await getCustomers(req.query);
    res.status(200).json(customers);

  } catch (err) {
    res.status(400).send(err);
  }

};

export const create = async (req, res) => {

  try {
    const customer = await addCustomer(req.body);
    res.status(200).json({message: "Cliente cadastrado com sucesso!", customer})

  } catch (err) {
    res.status(400).send(err);
  }

};

export const update = async (req, res) => {

  try {
    const customer = await updateCustomer(req);
    res.status(201).json({message: `Cadastro do cliente ${customer.name} atualizado com sucesso!`, customer});

  } catch (err) {
    res.status(400).send(err);
  }

};

export const remove = async (req, res) => {
  try {
    const customer = await deleteCustomer(req.params);
    res.status(200).json({ message: "Cadastro removido com sucesso!", customer });
    
  } catch (err) {
    console.log("err --> ", err)
    res.status(400).send(err);
  }
}
