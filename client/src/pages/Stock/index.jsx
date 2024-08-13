import { useEffect, useState } from "react";
import {
  Table,
  Input,
  Select,
  Space,
  Divider,
  Tooltip,
  Alert,
  Button,
  Card,
  message
} from "antd";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import AddItemForm from "../../components/AddItemForm";
import { getItems, deleteItem } from "../../controllers/ItemController";
import { AxiosError } from "axios";
import Link from "antd/es/typography/Link";

const { Option } = Select;
const { Search } = Input;

function Stock() {
  const [stock, setStock] = useState([]);
  const [searchFor, setSearchFor] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchMode, setSearchMode] = useState(false);
  const [viewAddNewItem, setViewAddNewItem] = useState(false);

  const handleViewAddNew = () => {
    setViewAddNewItem(true);
  };

  const handleSearch = (value, _e, info) => {
    const searchParams = { [searchFor]: value };

    if (info?.source === "input" && value !== "") {
      getItems(searchParams).then((result) => setStock(result));
      setSearchTerm(value);
      setSearchMode(true);
    } else if (info?.source === "input" && value === "") {
      console.log("digite uma busca válida");
    } else {
      setSearchMode(false);
      getItems().then((result) => setStock(result));
    }
  };

  const translateSearchFor = (term) => {
    if (term === "imei") return "IMEI";
    if (term === "model") return "Modelo";
    if (term === "color") return "Cor";
    if (term === "capacity") return "Capacidade";
    if (term === "battery") return "Bateria";

    return term;
  };

  const selectOptions = (
    <Select
      placeholder="Buscar por"
      style={{ width: 150 }}
      onSelect={(value) => {
        setSearchFor(value);
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
      dataIndex: "imei"
    },
    {
      title: "Modelo",
      dataIndex: "model",
      showSorterTooltip: {
        target: "model"
      }
    },
    {
      title: "Cor",
      dataIndex: "color"
    },
    {
      title: "Capacidade",
      dataIndex: "capacity",
      render: (value) => {
        return <span> {value} GB </span>;
      }
    },
    {
      title: "Bateria",
      dataIndex: "battery",
      render: (value) => {
        return <span> {value} % </span>;
      }
    },
    {
      title: "Detalhes",
      dataIndex: "details"
    },
    {
      title: "Custo",
      dataIndex: "unitPrice",
      render: (value) => {
        return <span>R$ {new Intl.NumberFormat("pt-BR").format(value)} </span>;
      }
    },
    {
      title: "Taxa",
      dataIndex: "tax"
    },
    {
      title: "Status",
      dataIndex: "status"
    },
    {
      title: "Ações",
      render: (value) => {
        return (
          <>
            <Tooltip title="Editar produto">
              <EditOutlined
                style={{ marginRight: 8 }}
                onClick={() => {
                  console.log("editar");
                }}
              />
            </Tooltip>
            <span> | </span>
            <Tooltip title="Excluir produto">
              <DeleteOutlined
                style={{ color: "red", marginLeft: 8 }}
                onClick={() =>
                  deleteItem(value.id).then((result) => {
                    message.success(result.message);
                  })
                }
              />
            </Tooltip>
          </>
        );
      }
    }
  ];

  useEffect(() => {
    getItems().then((result) => {
      // TODO: Refac this error method
      if (result instanceof AxiosError) {
        console.log("result ---> ", result.message);
      } else {
        setStock(result);
      }
    });
  }, []);

  return (
    <>
      <Space direction="horizontal" size="large" style={{ width: "100%" }}>
        <h1>Estoque</h1>
        <Button
          type="primary"
          size="large"
          onClick={handleViewAddNew}
          icon={<PlusOutlined />}
        >
          Adicionar produto
        </Button>
      </Space>
      {viewAddNewItem && (
        <>
          <Divider />
          <Space size="large">
            <Card>
              <h2>Adicionar produto</h2>
              <br />
              <AddItemForm handleGetStock={handleSearch} />
            </Card>
          </Space>
        </>
      )}
      <Divider />
      <Space direction="vertical" size={"large"} style={{ width: "100%" }}>
        <h3>Buscar produto por característica:</h3>
        <Search
          placeholder="Digite sua busca"
          size="large"
          onSearch={handleSearch}
          addonBefore={selectOptions}
          enterButton="Buscar"
          allowClear
          onClear={handleSearch}
        />
        <Alert
          message="Digite uma busca válida"
          type="warning"
          showIcon
          closable
        ></Alert>
      </Space>
      <Divider />
      {searchMode && (
        <Space style={{ marginBottom: 24 }}>
          <h2>
            Mostrando {stock.length} resultado{stock.length > 1 ? "s" : ""} da
            busca por:{" "}
            <strong>&quot;{translateSearchFor(searchFor)}&quot;</strong> e{" "}
            <strong>&quot;{searchTerm}&quot;</strong>
          </h2>
          <Divider type="vertical" />
          <Link onClick={handleSearch}>Limpar resultados</Link>
        </Space>
      )}
      <br />
      <Table
        dataSource={stock}
        columns={columns}
        rowKey={(record) => record.id}
        showSorterTooltip={{
          target: "sorter-icon"
        }}
        size="middle"
        pagination={false}
        bordered
      />
    </>
  );
}

export default Stock;
