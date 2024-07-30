import express from "express";
import { PrismaClient } from "@prisma/client";
// import bodyParser from "body-parser";
// import cors from "cors";
// import router from "./routes.js";

import { URL } from "url";
import { config } from "dotenv";
config({ path: new URL("../.env", import.meta.url).pathname });

const prisma = new PrismaClient();
const app = express();
app.use(express.json());

// LIST ALL STOCK ITEMS
app.get("/stock", async (req, res) => {

	let stock = [];

	try {
		if (Object.keys(req.query).length) {
      stock = await prisma.stock.findMany({
        where: {
          OR: [
            {
              imei: {
                contains: req.query.imei
              }
            },
            {
              model: {
                contains: req.query.model,
                mode: "insensitive"
              }
            },
            {
              color: {
                contains: req.query.color,
                mode: "insensitive"
              }
            },
            {
              capacity: parseInt(req.query.capacity)
            }
          ]
        }
      });
    } else {
      stock = await prisma.stock.findMany();
    }
	} catch (err) {
		console.log(err);
	}

  res.status(200).json(stock);
});

// CREATE NEW STOCK ITEM
app.post("/stock", async (req, res) => {
  await prisma.stock.create({
    data: {
      imei: req.body.imei,
      model: req.body.model,
      color: req.body.color,
      capacity: req.body.capacity
    }
  });

  res.status(201).send("Produto cadastrado com sucesso!");
});

// UPDATE STOCK ITEMS
app.put("/stock/:id", async (req, res) => {
  await prisma.stock.update({
    where: {
      id: req.params.id
    },
    data: {
      model: req.body.model,
      color: req.body.color,
      capacity: req.body.capacity
    }
  });

  res.status(201).send("Produto atualizado com sucesso!");

});

// DELETE STOCK ITEM
app.delete("/stock/:id", async (req, res) => {
    await prisma.stock.delete({
        where: {
            id: req.params.id
        },
    });

    res.status(200).json({ message: "Produto removido do Estoque!" });
});

app.listen(process.env.PORT, () => {
  console.log(`running on: ${process.env.PORT}`);
});
