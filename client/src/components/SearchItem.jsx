import { useState } from "react";
import { Alert, Divider, Input, Select, Space, Typography } from "antd";
import { getItems } from "../../controllers/ItemController";

const { Option } = Select;
const { Search } = Input;

function SearchItem() {
  const [searchFor, setSearchFor] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchMode, setSearchMode] = useState(false);
  const [showSearchAlert, setShowSearchAlert] = useState(false);
  const [stock, setStock] = useState([]);

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
  return (
    <>
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
      {searchMode && (
        <Space style={{ marginBottom: 24 }}>
          <h2>
            Mostrando {stock.length} resultado{stock.length > 1 ? "s" : ""} da
            busca por:{" "}
            <strong>&quot;{translateSearchFor(searchFor)}&quot;</strong> e{" "}
            <strong>&quot;{searchTerm}&quot;</strong>
          </h2>
          <Divider type="vertical" />
          <Typography.Link onClick={handleSearch}>
            Limpar resultados
          </Typography.Link>
        </Space>
      )}
    </>
  );
}

export default SearchItem;
