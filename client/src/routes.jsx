import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Stock from "./pages/Stock";
import Orders from "./pages/Orders";
import Customers from "./pages/Customers";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" index element={<Dashboard />} />
      <Route path="/stock" element={<Stock />} />
      <Route path="/orders" element={<Orders />} />
      <Route path="/customers" element={<Customers />} />
    </Routes>
  );
}

export default AppRoutes;
