import { index, create, update, cancel, remove } from "../controllers/order.controller.js";

const orderRoutes = app => {
    app.get("/orders", index);
    app.post("/orders", create);
    app.put("/order/:id", update );
    app.delete("/order/:id", remove );
    app.patch("/order/:id", cancel);
}

export default orderRoutes;