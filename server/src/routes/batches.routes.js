import { index, create, update, remove } from "../controllers/batch.controller.js";

const batchesRoutes = app => {
    app.get("/batch", index);
    app.post("/batch", create);
    app.put("/batch/:id", update );
    app.delete("/batch/:id", remove);
}

export default batchesRoutes;