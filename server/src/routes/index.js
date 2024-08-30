import stockRoutes from "./stock.routes.js";
import customerRoutes from "./customer.routes.js";
import orderRoutes from "./orders.routes.js";

const routes = app => {
    stockRoutes(app);
    customerRoutes(app);
    orderRoutes(app);
}

export default routes;