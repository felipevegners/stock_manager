import { Card, Divider, Row, Col, Space, message } from "antd";
import AddBatchForm from "../../components/AddBatchForm";
import { BatchContext } from "./BatchContext";
import BatchesTable from "../../components/BatchesTable";

import {
  createBatch,
  deleteBatch,
  getBatches,
  updateBatch
} from "../../controllers/BatchController";
import { useEffect, useState } from "react";

function Batches() {
  const [isLoading, setIsLoading] = useState(true);
  const [batches, setBatches] = useState([]);

  const fetchData = async () => {
    await getBatches().then((result) => {
      if (result?.response?.status === 400) {
        message.error("Erro ao carregar dados dos lotes. Atualize a página");
      } else {
        setBatches(result);
        setTimeout(() => {
          setIsLoading(false);
        }, 1000);
      }
    });
  };

  const createNewBatch = async (newBatchData) => {
    await createBatch(newBatchData).then((result) => {
      if (result?.response?.status === 400)
        message.error("Lote não criado. Verifique os dados inseridos.");
      else {
        message.success(result.message);
      }
    });
  };

  const upDateBatchData = async (batchId, batchData) => {
    await updateBatch(batchId, batchData).then((result) => {
      if (result?.response?.status === 400)
        message.error("Lote não atualizado. Verifique os dados inseridos.");
      else {
        message.success(result.message);
        setTimeout(() => {
          fetchData();
        }, 1000);
      }
    });
  };

  const removeBatch = (batchId) => {
    deleteBatch(batchId).then((result) => {
      if (result?.response?.status === 400)
        message.error("Lote não exluído. Tente novamente.");
      else {
        message.success(result.message);
        setTimeout(() => {
          fetchData();
        }, 1000);
      }
    });
  };

  useEffect(() => {
    fetchData();
  }, []);
  return (
    <BatchContext.Provider
      value={{
        batches,
        isLoading,
        fetchData,
        createNewBatch,
        upDateBatchData,
        removeBatch
      }}
    >
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <h1>Gerenciar Lotes </h1>
      </Space>
      <Divider />
      <Card>
        <Row
          gutter={{
            xs: 8,
            sm: 16,
            md: 24,
            lg: 32
          }}
        >
          <Col span={6}>
            {" "}
            <h2>Criar novo lote</h2>
            <Divider />
            <AddBatchForm />
          </Col>
          <Col span={18}>
            <h2>Lotes criados</h2>
            <Divider />
            <BatchesTable batches={batches} />
          </Col>
        </Row>
      </Card>
    </BatchContext.Provider>
  );
}

export default Batches;
