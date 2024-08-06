import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Stock from "./pages/Stock";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/stock" element={<Stock />} />
    </Routes>
  );
}

export default AppRoutes;
