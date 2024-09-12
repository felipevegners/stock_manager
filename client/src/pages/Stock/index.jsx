import { useEffect, useState } from "react";
import { Space, Divider, Button, Spin, message } from "antd";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { getItems } from "../../controllers/ItemController";
import ItemsTable from "../../components/ItemsTable";
import { ItemContext } from "./ItemContext";
import { useNavigate } from "react-router-dom";
import { getCategories } from "../../controllers/CategoriesController";

function Stock() {
  const [stock, setStock] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modelsCat, setmodelsCat] = useState([]);
  const [colorsCat, setColorsCat] = useState([]);
  const [capacityCat, setCapacityCat] = useState([]);

  const navigate = useNavigate();

  const handleViewAddNew = () => {
    navigate("/stock/add");
  };

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
    await getCategories().then((result) => {
      const models = result.filter((cat) => cat.name === "Modelos");
      setmodelsCat(models[0].content);
      const colors = result.filter((cat) => cat.name === "Cores");
      setColorsCat(colors[0].content);
      const capacity = result.filter((cat) => cat.name === "Capacidade");
      setCapacityCat(capacity[0].content);
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <ItemContext.Provider
      value={{ fetchData, stock, modelsCat, colorsCat, capacityCat }}
    >
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
        <h4>Total de itens em estoque: {stock.length}</h4>
      </Space>
      <Divider />
      {isLoading ? (
        <Spin
          spinning={isLoading}
          indicator={<LoadingOutlined spin />}
          size="large"
        />
      ) : (
        <ItemsTable />
      )}
    </ItemContext.Provider>
  );
}

export default Stock;
