import { useEffect, useState } from "react";
import { Table, Input, Select, Button, Space, Divider } from "antd";
import AddItemForm from "../../components/AddItemForm";
import API from "../../services/api";

const { Option } = Select;
const { Search } = Input;

const checkBoxOptions = (
  <Select
    defaultValue="Modelo"
    style={{ width: 150 }}
    onSelect={(value) => {
      console.log(value);
    }}
  >
    <Option value="imei">IMEI</Option>
    <Option value="model">Modelo</Option>
    <Option value="color">Cor</Option>
    <Option value="capacity">Capacidade</Option>
    <Option value="battery">Bateria</Option>
  </Select>
);

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
    }
    // onFilter: (value, record) => record.model.indexOf(value) === 0
    // sorter: (a, b) => a.model.length - b.model.length,
    // sortDirections: ["ascend"]
  },
  {
    title: "Cor",
    dataIndex: "color",
    key: "color"
  },
  {
    title: "Capacidade",
    dataIndex: "capacity",
    render: (value) => {
      return <span> {value} GB </span>;
    }
    // sorter: (a, b) => a.capacity - b.capacity
  },
  {
    title: "Bateria",
    dataIndex: "battery",
    key: "battery",
    render: (value) => {
      return <span> {value} % </span>;
    }
  },
  {
    title: "Detalhes",
    dataIndex: "details",
    key: "details"
  },
  {
    title: "Custo",
    dataIndex: "unitPrice",
    key: "unitPrice",
    render: (value) => {
      return <span>R$ {new Intl.NumberFormat("pt-BR").format(value)} </span>;
    }
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
    title: "Ações",
    render: () => {
      return (
        <>
          <span>Editar</span>
          <span> | </span>
          <span>Excluir</span>
        </>
      );
    }
  }
];

function Stock() {
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
    <>
      <Space direction="vertical" size={"large"} style={{ width: "100%" }}>
        <h1>Estoque</h1>
        <Divider />
        <Button type="primary" size="large">
          Adicionar produto
        </Button>
        <Divider />
        <AddItemForm />
        <h3>Buscar produto por característica:</h3>
        <Search
          placeholder="Digite sua busca"
          size="large"
          onSearch={getStock}
          enterButton
          addonBefore={checkBoxOptions}
        />
      </Space>
      <Divider />
      <Table
        dataSource={stock}
        columns={columns}
        showSorterTooltip={{
          target: "sorter-icon"
        }}
        size="middle"
        pagination={false}
        bordered
      />
      <Divider />
      <Space>
        <Button type="primary" size="large">
          Editar produto
        </Button>
        <Button type="primary" size="large" danger>
          Deletar produto
        </Button>
      </Space>
    </>
  );
}

export default Stock;
