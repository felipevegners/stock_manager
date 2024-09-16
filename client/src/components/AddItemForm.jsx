import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Card,
  Col,
  Divider,
  Form,
  Input,
  InputNumber,
  Popover,
  Row,
  Select,
  Space,
  Typography,
  message
} from "antd";
import { createItem } from "../controllers/ItemController";
import { getBatches } from "../controllers/BatchController";
import { QuestionCircleFilled } from "@ant-design/icons";
import { currencyHelper } from "../helpers/CurrencyHelper";
import TextArea from "antd/es/input/TextArea";
import { getCategories } from "../controllers/CategoriesController";
import MaskedInput from "./MaskedInput";

// eslint-disable-next-line react/prop-types
function AddItemForm() {
  const [batches, setBatches] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState([]);
  const [showBatchData, setShowBatchData] = useState(false);
  const [modelsCat, setmodelsCat] = useState([]);
  const [colorsCat, setColorsCat] = useState([]);
  const [capacityCat, setCapacityCat] = useState([]);

  const navigate = useNavigate();
  const [form] = Form.useForm();

  const addNewItem = (values) => {
    const {
      imei,
      model,
      color,
      capacity,
      battery,
      details,
      status,
      itemCosts,
      totalCosts
    } = values;

    const newItemData = {
      batch: { id: selectedBatch[0].id, name: selectedBatch[0].batchName },
      imei,
      model,
      color,
      capacity,
      battery,
      details,
      itemCosts: parseFloat(itemCosts, 2),
      totalCosts: parseFloat(totalCosts, 2),
      status,
      isAvailable:
        status === "Em trânsito" ? false : status === "Reparo" ? false : true
    };

    createItem(newItemData).then((result) => {
      if (result?.response?.status === 400)
        message.error("Produto não cadastrado. Verifique os dados inseridos.");
      else {
        form.resetFields();
        setTimeout(() => {
          navigate("/stock/list");
        }, 1000);
        message.success(result.message);
      }
    });
  };

  const fetchData = async () => {
    await getBatches().then((result) => {
      if (result?.response?.status === 400) {
        message.error("Lotes não encontrados. Tente novamente!");
      } else {
        setBatches(result);
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

  const handleSelectedBatch = (value) => {
    const selectedBatch = batches.filter((batch) => batch.batchName === value);
    setSelectedBatch(selectedBatch);
    setShowBatchData(true);
    form.setFieldsValue({
      tax: selectedBatch[0].batchTax
    });
  };

  const handleBatchDataInfo = () => {
    return (
      <>
        <h3>
          <strong>Lote: {selectedBatch[0]?.batchName}</strong>
        </h3>
        <hr />
        <br />
        <p>
          <strong>Data: </strong>
          {selectedBatch[0]?.batchDate}
        </p>
        <p>
          <strong>Qtd Produtos: </strong>
          {selectedBatch[0]?.batchQty}
        </p>
        <p>
          <strong>Taxa USD: </strong>
          {currencyHelper(selectedBatch[0]?.batchTax)}
        </p>
        <p>
          <strong>Frete: </strong>
          {currencyHelper(selectedBatch[0]?.batchFreight)}
        </p>
        <p>
          <strong>Motoboy: </strong>
          {currencyHelper(selectedBatch[0]?.batchBoyPrice)}
        </p>
      </>
    );
  };

  const calculateFinalCosts = (value) => {
    const itemCost = value;
    const { batchTax, batchQty, batchFreight, batchBoyPrice } =
      selectedBatch[0];
    const brlCosts = itemCost * batchTax;
    const ratedFreight = (batchFreight + batchBoyPrice) / batchQty;
    const totalCosts = brlCosts + ratedFreight;

    form.setFieldsValue({
      totalCosts: totalCosts.toFixed(2)
    });
  };

  const onFinish = (values) => {
    addNewItem(values);
  };

  useEffect(() => {
    fetchData();
  }, [selectedBatch]);

  return (
    <>
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <Typography.Link onClick={() => navigate("/stock/list")}>
          {" "}
          {"< Voltar"}
        </Typography.Link>
        <h1>Adicionar Novo Produto </h1>
      </Space>
      <Divider />
      <Card>
        <Form
          form={form}
          layout="vertical"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 14 }}
          onFinish={onFinish}
        >
          <Row
            gutter={{
              xs: 8,
              sm: 16,
              md: 24,
              lg: 32
            }}
          >
            <Col span={6}>
              <Form.Item label="Lote">
                <Space>
                  <Form.Item
                    name="batch"
                    noStyle
                    rules={[
                      {
                        required: true,
                        message: "Selecione o lote do item"
                      }
                    ]}
                  >
                    <Select
                      style={{ width: 248 }}
                      onSelect={(value) => handleSelectedBatch(value)}
                    >
                      {batches &&
                        batches.map((batch) => (
                          <Select.Option key={batch.id} value={batch.batchName}>
                            {batch.batchName}
                          </Select.Option>
                        ))}
                    </Select>
                  </Form.Item>
                  {showBatchData && (
                    <Popover content={handleBatchDataInfo}>
                      <QuestionCircleFilled
                        style={{ color: "#bbb", fontSize: 16 }}
                      />
                    </Popover>
                  )}
                </Space>
              </Form.Item>
              <Form.Item
                label="IMEI"
                name="imei"
                rules={[
                  {
                    required: true,
                    message: "Insira um IMEI válido"
                  }
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Modelo"
                name="model"
                rules={[
                  {
                    required: true,
                    message: "Insira o modelo do item"
                  }
                ]}
              >
                <Select style={{ width: 248 }}>
                  {modelsCat &&
                    modelsCat.map((model, index) => (
                      <Select.Option key={index} value={model}>
                        {model}
                      </Select.Option>
                    ))}
                  <Select.Option>
                    <Typography.Link
                      onClick={() => navigate("/stock/categories")}
                    >
                      Adicionar Modelo
                    </Typography.Link>
                  </Select.Option>
                </Select>
              </Form.Item>
              <Form.Item
                label="Cor"
                name="color"
                rules={[
                  {
                    required: true,
                    message: "Insira a cor do item"
                  }
                ]}
              >
                <Select style={{ width: 248 }}>
                  {colorsCat &&
                    colorsCat.map((color, index) => (
                      <Select.Option key={index} value={color}>
                        {color}
                      </Select.Option>
                    ))}
                  <Select.Option>
                    <Typography.Link
                      onClick={() => navigate("/stock/categories")}
                    >
                      Adicionar Cor
                    </Typography.Link>
                  </Select.Option>
                </Select>
              </Form.Item>
              <Form.Item
                label="Capacidade"
                name="capacity"
                rules={[
                  {
                    required: true,
                    message: "Insira a capacidade em GB"
                  }
                ]}
              >
                <Select style={{ width: 248 }}>
                  {capacityCat &&
                    capacityCat.map((capacity, index) => (
                      <Select.Option key={index} value={capacity}>
                        {capacity}
                      </Select.Option>
                    ))}
                  <Select.Option>
                    <Typography.Link
                      onClick={() => navigate("/stock/categories")}
                    >
                      Adicionar Capacidade
                    </Typography.Link>
                  </Select.Option>
                </Select>
              </Form.Item>
              <Form.Item
                label="Bateria"
                name="battery"
                rules={[
                  {
                    required: true,
                    message: "Insira o estado da bateria"
                  }
                ]}
              >
                <Input type="number" />
              </Form.Item>
            </Col>
            <Col span={10} offset={2}>
              <Form.Item
                label="Custo em Dólares"
                name="itemCosts"
                rules={[
                  {
                    required: true,
                    message: "Insira o custo unitário"
                  }
                ]}
              >
                <InputNumber
                  step="0.01"
                  addonBefore="U$D"
                  disabled={selectedBatch.length === 0}
                  onChange={(value) => calculateFinalCosts(value)}
                />
              </Form.Item>
              <Form.Item label="Custo Final (Cálculo)" name="totalCosts">
                <MaskedInput
                  type="numeric"
                  customInput={Input}
                  readOnly={true}
                  prefix="R$"
                />
                {/* <InputNumber step="0.01" addonBefore="R$" readOnly /> */}
              </Form.Item>

              <Form.Item
                label="Status"
                name="status"
                rules={[
                  {
                    required: true,
                    message: "Insira o status do item"
                  }
                ]}
              >
                <Select>
                  <Select.Option value="Em trânsito">Em trânsito</Select.Option>
                  <Select.Option value="Em estoque">Em estoque</Select.Option>
                  <Select.Option value="Reparo">Reparo</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item label="Detalhes" name="details">
                <TextArea />
              </Form.Item>
              <Button type="primary" htmlType="submit" size="large">
                Cadastrar produto
              </Button>
            </Col>
          </Row>
        </Form>
      </Card>
    </>
  );
}

export default AddItemForm;
