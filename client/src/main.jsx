import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes";
import { Layout } from "antd";
import NavMenu from "./components/NavMenu";

import vgnLogo from "./assets/logo_vgn.svg";

const { Header, Content, Footer } = Layout;

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Layout>
        <Header style={{ display: "flex", alignItems: "center" }}>
          <img src={vgnLogo} alt="" style={{ width: 48, marginRight: 16 }} />
          <h3 style={{ color: "#fff", marginRight: 32 }}>| STOCK MANAGER</h3>
          <NavMenu />
        </Header>
        <Content style={{ padding: "36px" }}>
          <AppRoutes />
        </Content>
        <Footer></Footer>
      </Layout>
    </BrowserRouter>
  </React.StrictMode>
);
