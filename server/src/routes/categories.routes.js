import {
  index,
  create,
  update,
  remove
} from "../controllers/categories.controller.js";

const batchesRoutes = (app) => {
  app.get("/categories", index);
  app.post("/categories", create);
  app.put("/categories/:id", update);
  app.delete("/categories/:id", remove);
};

export default batchesRoutes;
