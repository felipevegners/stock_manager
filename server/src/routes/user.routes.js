import {
  index,
  create,
  loginUser,
  remove,
  update
} from "../controllers/user.controller.js";

const userRoutes = (app) => {
  app.get("/user", index);
  app.post("/user/register", create);
  app.post("/user/login", loginUser);
  app.put("/user/:id", update);
  app.delete("/user/:id", remove);
};

export default userRoutes;
