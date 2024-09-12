import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Stock from "./pages/Stock";
import Orders from "./pages/Orders";
import Customers from "./pages/Customers";
import AddItemForm from "./components/AddItemForm";
import Batches from "./pages/Batch";
import Categories from "./pages/Categories";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" index element={<Dashboard />} />
      <Route path="/stock/add" element={<AddItemForm />} />
      <Route path="/stock/list" element={<Stock />} />
      <Route path="/stock/batch" element={<Batches />} />
      <Route path="/stock/categories" element={<Categories />} />
      <Route path="/orders" element={<Orders />} />
      <Route path="/customers" element={<Customers />} />
    </Routes>
  );
}

export default AppRoutes;
