import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Stock from "./pages/Stock";
import Orders from "./pages/Orders";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" index element={<Dashboard />} />
      <Route path="/stock" element={<Stock />} />
      <Route path="/orders" element={<Orders />} />
    </Routes>
  );
}

export default AppRoutes;
