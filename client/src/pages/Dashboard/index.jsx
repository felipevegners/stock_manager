import { useEffect, useState } from "react";
import API from "../../services/api";
import "./styles.css";

import { Layout, Menu, Table } from "antd";

const { Header, Content, Footer } = Layout;

const navItems = [
  {
    key: 1,
    label: "Estoque"
  },
  {
    key: 2,
    label: "Pedidos"
  },
  {
    key: 3,
    label: "Clientes"
  },
  {
    key: 4,
    label: "Relatórios"
  }
];

const columns = [
  {
    title: "IMEI",
    dataIndex: "imei",
    key: "imei"
  },
  {
    title: "Modelo",
    dataIndex: "model",
    showSorterTooltip: {
      target: "model"
    },
    onFilter: (value, record) => record.model.indexOf(value) === 0,
    sorter: (a, b) => a.model.length - b.model.length,
    sortDirections: ["ascend"]
  },
  {
    title: "Cor",
    dataIndex: "color",
    key: "color"
  },
  {
    title: "Capacidade",
    dataIndex: "capacity",
    defaultSortOrder: "ascend",
    sorter: (a, b) => a.capacity - b.capacity
  },
  {
    title: "Condição",
    dataIndex: "condition",
    key: "condition"
  },
  {
    title: "Quantidade",
    dataIndex: "qty",
    key: "qty"
  },
  {
    title: "Preço Unitário",
    dataIndex: "unitPrice",
    key: "unitPrice"
  },
  {
    title: "Taxa",
    dataIndex: "tax",
    key: "tax"
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status"
  },
  {
    title: "Disponível",
    dataIndex: "isAvailable",
    key: "isAvailable"
  }
];

function Dashboard() {
  const [stock, setStock] = useState([]);

  // TODO: refac for better structure
  async function getStock() {
    const payload = await API.get("/stock");

    setStock(payload.data);
  }

  useEffect(() => {
    getStock();
  }, []);

  return (
    <Layout>
      <Header style={{ display: "flex", alignItems: "center" }}>
        <div className="demo-logo" />
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={["1"]}
          items={navItems}
          style={{ flex: 1, minWidth: 10 }}
        />
      </Header>
      <Content style={{ padding: "36px" }}>
        <Table
          dataSource={stock}
          columns={columns}
          showSorterTooltip={{
            target: "sorter-icon"
          }}
          size="middle"
        />
      </Content>
      <Footer style={{ textAlign: "center" }}>
        Ant Design ©{new Date().getFullYear()} Created by Ant UED
      </Footer>
    </Layout>
  );
}

export default Dashboard;
