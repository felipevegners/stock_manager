import express from "express";
import cors from "cors";
import { URL } from "url";
import { config } from "dotenv";
import routes from "./routes/index.js";

config({ path: new URL("../.env", import.meta.url).pathname });
const app = express();
app.use(express.json());

// TODO: configure CORS for production
app.use(cors());

routes(app);

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
