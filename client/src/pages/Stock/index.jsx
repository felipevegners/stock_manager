import { useEffect, useState } from "react";
import {
  Input,
  Select,
  Space,
  Divider,
  Alert,
  Button,
  Spin,
  message
} from "antd";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
// import AddItemForm from "../../components/AddItemForm";
import { getItems } from "../../controllers/ItemController";
import Link from "antd/es/typography/Link";
import ItemsTable from "../../components/ItemsTable";
import { ItemContext } from "./ItemContext";
import { useNavigate } from "react-router-dom";

const { Option } = Select;
const { Search } = Input;

function Stock() {
  const [stock, setStock] = useState([]);
  const [searchFor, setSearchFor] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchMode, setSearchMode] = useState(false);
  const [showSearchAlert, setShowSearchAlert] = useState(false);
  // const [viewAddNewItem, setViewAddNewItem] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  const handleViewAddNew = () => {
    navigate("/stock/add");
  };

  const handleSearch = (value, _e, info) => {
    const searchParams = { [searchFor]: value };

    if (info?.source === "input" && value !== "") {
      getItems(searchParams).then((result) => setStock(result));
      setSearchTerm(value);
      setSearchMode(true);
    } else if (info?.source === "input" && value === "") {
      setShowSearchAlert(true);
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
      if (result?.response?.status === 400) {
        message.error("Produto não encontrado. Tente novamente.");
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
    <ItemContext.Provider value={fetchData}>
      <Space direction="horizontal" size="large" style={{ width: "100%" }}>
        <h1>Estoque Ativo</h1>
        <Button
          type="primary"
          size="large"
          onClick={handleViewAddNew}
          icon={<PlusOutlined />}
        >
          Adicionar produto
        </Button>
      </Space>
      {/* {viewAddNewItem && (
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
              <AddItemForm />
            </Card>
          </Space>
        </>
      )} */}
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
        {showSearchAlert && (
          <Alert
            message="Digite uma busca válida"
            type="warning"
            showIcon
            closable
            onClose={() => setShowSearchAlert(false)}
          />
        )}
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
    </ItemContext.Provider>
  );
}

export default Stock;
