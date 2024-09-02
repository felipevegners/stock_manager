import { createBatch, deleteBatch, getBatches, updateBatch } from "../repositories/batch.repository.js"

export const index = async (req, res) => {

  try {
    const batches = await getBatches(req.query);
    res.status(200).json(batches);

  } catch (err) {
    res.status(400).send(err);
  }

};

export const create = async (req, res) => {

  try {
    const batch = await createBatch(req.body);
    res.status(200).json({message: "Lote cadastrado com sucesso!", batch})

  } catch (err) {
    res.status(400).send(err);
  }

};

export const update = async (req, res) => {

  try {
    const batch = await updateBatch(req);
    res.status(201).json({message: `Lote ${batch.batchName} atualizado com sucesso!`, batch});

  } catch (err) {
    res.status(400).send(err);
  }

};

export const remove = async (req, res) => {
  try {
    const batch = await deleteBatch(req.params);
    res.status(200).json({ message: "Lote removido com sucesso!", batch });
    
  } catch (err) {
    res.status(400).send(err);
  }
}