/* eslint-disable react/prop-types */
import { useContext } from "react";
import AuthContext from "./AuthContext";
import Login from "../pages/Login/login";
import { Avatar, Dropdown, Layout, Space } from "antd";
const { Header, Content, Footer } = Layout;
import NavMenu from "../components/NavMenu";
import "../index.css";
import {
  DownOutlined,
  LogoutOutlined,
  SettingOutlined,
  UserOutlined
} from "@ant-design/icons";

function RequireAuth({ children }) {
  const { isAuthenticated, logout } = useContext(AuthContext);
  const username = localStorage.getItem("username");

  const items = [
    {
      key: "1",
      label: "Meu usuário",
      disabled: true
    },
    {
      type: "divider"
    },
    {
      key: "2",
      label: "Meus dados",
      extra: "⌘P"
    },
    {
      key: "3",
      label: <a onClick={() => logout()}>Sair do sistema</a>,
      icon: <LogoutOutlined />,
      extra: "⌘S"
    }
  ];

  // const items = [
  //   {
  //     label: (
  //       <>
  //         <a target="_blank" rel="noopener noreferrer" onClick={() => logout()}>
  //           Sair do sistema
  //         </a>
  //       </>
  //     ),
  //     key: "0"
  //   },
  //   {
  //     label: (
  //       <>
  //         <a target="_blank" rel="noopener noreferrer" onClick={() => logout()}>
  //           Sair do sistema
  //         </a>
  //       </>
  //     ),
  //     key: "0"
  //   }
  // ];

  return isAuthenticated() ? (
    <Layout>
      <Header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between"
        }}
      >
        <div style={{ display: "flex" }}>
          <h3 style={{ color: "#fff", marginRight: 32 }}>STOCK MANAGER</h3>
          <NavMenu />
        </div>
        <div style={{ alignSelf: "right" }}>
          <Avatar
            size={40}
            icon={<UserOutlined />}
            style={{
              backgroundColor: "#3a86e9",
              color: "#ffffff",
              marginRight: 14
            }}
          ></Avatar>
          <Dropdown menu={{ items }} className="user-dropdown">
            <a onClick={(e) => e.preventDefault()}>
              <Space>
                {username}
                <DownOutlined />
              </Space>
            </a>
          </Dropdown>
        </div>
      </Header>
      <Content className="layout-content">{children}</Content>
      <Footer className="layout-footer">
        <p>STOCK MANAGER - Copyright 2024 - Todos os direitos reservados.</p>
      </Footer>
    </Layout>
  ) : (
    <Login />
  );
}

export default RequireAuth;
