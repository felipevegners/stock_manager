import express from "express";
import cors from "cors";
import { URL } from "url";
import { config } from "dotenv";
import routes from "./src/routes/index.js";

config({ path: new URL("../.env", import.meta.url).pathname });
const app = express();
app.use(express.json());

// TODO: configure CORS for production
app.use(cors());

app.use("/", (req, res) => {
  res.send("Server is running!")
})

// routes(app);

app.listen(process.env.PORT, () => {
  console.log(`running on: ${process.env.PORT}`);
});
