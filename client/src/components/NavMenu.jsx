import { Menu } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  DashboardOutlined,
  FileDoneOutlined,
  FundOutlined,
  ProductOutlined,
  UserOutlined
} from "@ant-design/icons";

const navigation = [
  {
    label: "Dashboard",
    icon: <DashboardOutlined />,
    key: "/"
  },
  {
    label: "Estoque",
    icon: <ProductOutlined />,
    key: "/stock",
    theme: "light",
    children: [
      {
        type: "group",
        label: "Gerenciar Estoque",
        children: [
          {
            label: "Produtos em Estoque",
            key: "/stock/list"
          },
          {
            label: "Adicionar produto",
            key: "/stock/add"
          }
        ]
      },
      {
        type: "group",
        label: "Lotes",
        children: [
          {
            label: "Gerenciar Lotes",
            key: "/stock/batch"
          }
        ]
      },
      {
        type: "group",
        label: "Categorias",
        children: [
          {
            label: "Editar Categorias",
            key: "/stock/categories"
          }
        ]
      }
    ]
  },
  {
    label: "Pedidos",
    icon: <FileDoneOutlined />,
    key: "/orders"
  },
  {
    label: "Clientes",
    icon: <UserOutlined />,
    key: "/customers"
  },
  {
    label: "Relatórios",
    icon: <FundOutlined />,
    key: "/reports"
  }
];

function NavMenu() {
  const navigate = useNavigate();
  const [key, setKey] = useState("");

  const handleMenuClick = ({ key }) => {
    setKey(key);
    navigate(key);
  };

  return (
    <Menu
      theme="dark"
      mode="horizontal"
      items={navigation}
      defaultSelectedKeys={[key]}
      selectedKeys={[key]}
      onClick={handleMenuClick}
      selectable={true}
    />
  );
}

export default NavMenu;
