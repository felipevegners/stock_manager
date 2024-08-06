import { Menu } from "antd";
import { useNavigate } from "react-router-dom";

const navigation = [
  {
    label: "Dashboard",
    key: "/"
  },
  {
    label: "Estoque",
    key: "/stock"
  },
  {
    label: "Pedidos",
    key: "/orders"
  },
  {
    label: "Clientes",
    key: "/customers"
  },
  {
    label: "Relatórios",
    key: "/reports"
  }
];

function NavMenu() {
  const navigate = useNavigate();

  const handleMenuClick = ({ key }) => {
    if (key) {
      console.log("caiu no if --> ", navigate(key));
      navigate(key);
    }
  };

  return (
    <Menu
      theme="dark"
      mode="horizontal"
      items={navigation}
      onClick={handleMenuClick}
    />
  );
}

export default NavMenu;
