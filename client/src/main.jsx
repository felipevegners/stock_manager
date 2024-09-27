import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Login from "./pages/Login/login";
import Register from "./pages/Login/register";
import RequireAuth from "./context/RequireAuth";
import "./index.css";
import Dashboard from "./pages/Dashboard";
import Stock from "./pages/Stock";
import Orders from "./pages/Orders";
import Customers from "./pages/Customers";
import AddItemForm from "./components/AddItemForm";
import Batches from "./pages/Batch";
import Categories from "./pages/Categories";
import UsersAdmin from "./pages/Users";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/"
            element={
              <RequireAuth>
                <Dashboard />
              </RequireAuth>
            }
          />
          <Route
            path="/stock/add"
            element={
              <RequireAuth>
                <AddItemForm />
              </RequireAuth>
            }
          />
          <Route
            path="/stock/list"
            element={
              <RequireAuth>
                <Stock />
              </RequireAuth>
            }
          />
          <Route
            path="/stock/batch"
            element={
              <RequireAuth>
                <Batches />
              </RequireAuth>
            }
          />
          <Route
            path="/stock/categories"
            element={
              <RequireAuth>
                <Categories />
              </RequireAuth>
            }
          />
          <Route
            path="/orders"
            element={
              <RequireAuth>
                <Orders />
              </RequireAuth>
            }
          />
          <Route
            path="/customers"
            element={
              <RequireAuth>
                <Customers />
              </RequireAuth>
            }
          />
          <Route
            path="/users"
            element={
              <RequireAuth>
                <UsersAdmin />
              </RequireAuth>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);
