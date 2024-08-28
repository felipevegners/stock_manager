import { useEffect, useState } from "react";
import { Input, Select, Space, Divider, Alert, Button, Card, Spin } from "antd";
import {
  CloseOutlined,
  LoadingOutlined,
  PlusOutlined
} from "@ant-design/icons";
import AddItemForm from "../../components/AddItemForm";
import { getItems } from "../../controllers/ItemController";
import { AxiosError } from "axios";
import Link from "antd/es/typography/Link";
import ItemsTable from "./ItemsTable";

const { Option } = Select;
const { Search } = Input;

function Stock() {
  const [stock, setStock] = useState([]);
  const [searchFor, setSearchFor] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchMode, setSearchMode] = useState(false);
  const [viewAddNewItem, setViewAddNewItem] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

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

  const fetchData = async () => {
    await getItems().then((result) => {
      // TODO: Refac this error method
      if (result instanceof AxiosError) {
        console.log("result ---> ", result.message);
      } else {
        setStock(result);
        setTimeout(() => {
          setIsLoading(false);
        }, 1000);
      }
    });
  };

  useEffect(() => {
    fetchData();
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
          <Space
            direction="vertical"
            size="large"
            style={{ display: "flex", width: "100%" }}
          >
            <Card
              title="Adicionar produto"
              extra={<CloseOutlined onClick={() => setViewAddNewItem(false)} />}
            >
              <AddItemForm fetchData={fetchData} />
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
      {isLoading ? (
        <Spin
          spinning={isLoading}
          indicator={<LoadingOutlined spin />}
          size="large"
        />
      ) : (
        <ItemsTable tableData={stock} fetchData={fetchData} />
      )}
    </>
  );
}

export default Stock;
