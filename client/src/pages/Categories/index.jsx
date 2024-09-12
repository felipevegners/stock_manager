import { useEffect, useState } from "react";
import { Card, Divider, message, Space, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import {
  getCategories,
  updateCategories
} from "../../controllers/CategoriesController";
import CategoriesTags from "../../components/CategoriesTags";
import { CategoriesContext } from "./CategoriesContext";

function Categories() {
  const [categories, setCategories] = useState([]);
  const [catType, setCatType] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    await getCategories().then((result) => {
      if (result?.response?.status === 400) {
        message.error(
          "Erro ao carregar dados das categorias. Atualize a página."
        );
      } else {
        setCategories(result);
        setTimeout(() => {
          const type = [
            ...result.reduce((set, { type }) => {
              set.add(type);
              return set;
            }, new Set())
          ];
          setCatType(type);
          setIsLoading(false);
        }, 1000);
      }
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <CategoriesContext.Provider value={{ updateCategories, fetchData }}>
      <Space direction="horizontal" size="large" style={{ width: "100%" }}>
        <h1>Gerenciar Categorias</h1>
      </Space>
      <Divider />
      {isLoading ? (
        <Spin
          spinning={isLoading}
          indicator={<LoadingOutlined spin />}
          size="large"
        />
      ) : (
        catType.map((name) => (
          <Card key={name} title={name}>
            {categories &&
              categories.map((cat) => (
                <Space
                  direction="vertical"
                  style={{ width: "100%" }}
                  key={cat.id}
                >
                  <h2>{cat.name}</h2>
                  <CategoriesTags tagsData={cat} />
                  <Divider />
                </Space>
              ))}
          </Card>
        ))
      )}
    </CategoriesContext.Provider>
  );
}

export default Categories;
