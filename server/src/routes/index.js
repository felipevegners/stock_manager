import stockRoutes from "./stock.routes.js";
import customerRoutes from "./customer.routes.js";

const routes = app => {
    stockRoutes(app);
    customerRoutes(app);
}

export default routes;