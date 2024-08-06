import { index, create, update, remove } from "../controllers/stock.controller.js";

const stockRoutes = app => {
    app.get("/stock", index);
    app.post("/stock", create);
    app.put("/item/:id", update );
    app.delete("/item/:id", remove);
}

export default stockRoutes;