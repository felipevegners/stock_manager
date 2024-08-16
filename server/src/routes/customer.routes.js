import { index, create, update, remove } from "../controllers/customer.controller.js";

const customerRoutes = app => {
    app.get("/customer", index);
    app.post("/customer", create);
    app.put("/customer/:id", update );
    app.delete("/customer/:id", remove);
}

export default customerRoutes;