import stockRoutes from "./stock.routes.js";

const routes = app => {
    stockRoutes(app);
}

export default routes;