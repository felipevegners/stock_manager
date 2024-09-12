import stockRoutes from "./stock.routes.js";
import customerRoutes from "./customer.routes.js";
import orderRoutes from "./orders.routes.js";
import batchesRoutes from "./batches.routes.js";
import categoriesRoutes from "./categories.routes.js";

const routes = (app) => {
  stockRoutes(app);
  customerRoutes(app);
  orderRoutes(app);
  batchesRoutes(app);
  categoriesRoutes(app);
};

export default routes;
