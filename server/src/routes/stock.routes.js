import { index, create } from "../controllers/stock.controller.js";

const stockRoutes = app => {
    app.get("/stock", index);
    app.post("/newitem", create);
}

export default stockRoutes;