import { index, create, update, cancel, remove } from "../controllers/order.controller.js";

const orderRoutes = app => {
    app.get("/orders", index);
    app.post("/orders", create);
    app.put("/order/:id", update );
    app.patch("/order/:id", cancel);
    app.delete("/order/:id", remove );
}

export default orderRoutes;