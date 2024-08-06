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

app.listen(process.env.PORT, () => {
  console.log(`running on: ${process.env.PORT}`);
});
