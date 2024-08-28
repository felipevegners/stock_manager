import { useRef } from "react";
import {
  Button,
  Col,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
  message
} from "antd";
import { CurrencyInput } from "react-currency-mask";
import { createItem } from "../controllers/ItemController";

// eslint-disable-next-line react/prop-types
function AddItemForm({ fetchData }) {
  const inputImei = useRef();
  const inputModel = useRef();
  const inputColor = useRef();
  const inputCapacity = useRef();
  const inputBattery = useRef();
  const inputUnitPrice = useRef();
  const inputTax = useRef();
  const inputProfit = useRef();
  const inputFinalPrice = useRef();
  const inputStatus = useRef();
  const inputDetails = useRef();

  const [form] = Form.useForm();

  const addNewItem = () => {
    const itemStatus = inputStatus.current.nativeElement.innerText;

    const newItemData = {
      imei: inputImei.current.input.value,
      model: inputModel.current.input.value,
      color: inputColor.current.input.value,
      capacity: inputCapacity.current.input.value,
      battery: inputBattery.current.input.value,
      unitPrice: parseFloat(inputUnitPrice.current.value, 2),
      tax: parseFloat(inputTax.current.value, 2),
      profit: parseFloat(inputProfit.current.value, 2),
      status: inputStatus.current.nativeElement.innerText,
      details: inputDetails.current.input.value,
      isAvailable:
        itemStatus === "Em trânsito"
          ? false
          : itemStatus === "Reparo"
          ? false
          : true
    };
    createItem(newItemData).then((result) => {
      if (result?.response?.status === 400)
        message.error("Produto não cadastrado. Verifique os dados inseridos.");
      else {
        message.success(result.message);
      }
    });
  };

  const calculateFinalPrice = () => {
    const unitPrice = parseFloat(inputUnitPrice.current.value, 2);
    const profit = parseFloat(inputProfit.current.value, 2);
    const sum = unitPrice + profit;
    form.setFieldValue("finalPrice", sum);
  };

  const onFinish = () => {
    addNewItem();
    form.resetFields();
    setTimeout(() => {
      fetchData();
    }, 1000);
  };

  return (
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
            <Input ref={inputImei} />
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
            <Input ref={inputModel} />
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
            <Input ref={inputColor} />
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
            <Input ref={inputCapacity} type="number" />
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
            <Input ref={inputBattery} type="number" />
          </Form.Item>
          <Form.Item
            label="Detalhes"
            name="details"
            rules={[
              {
                message: "Insira o detalhe do item"
              }
            ]}
          >
            <Input ref={inputDetails} />
          </Form.Item>
        </Col>
        <Col span={10} offset={2}>
          <Form.Item
            label="Custo"
            name="unitPrice"
            rules={[
              {
                required: true,
                message: "Insira o custo unitário"
              }
            ]}
          >
            <InputNumber
              step="0.01"
              ref={inputUnitPrice}
              addonBefore="R$"
              onChange={calculateFinalPrice}
            />
          </Form.Item>
          <Form.Item
            label="Taxa"
            name="tax"
            rules={[
              {
                required: true,
                message: "Insira a taxa negociada"
              }
            ]}
          >
            <InputNumber step="0.01" ref={inputTax} addonBefore="R$" />
          </Form.Item>
          <CurrencyInput
            onChangeValue={(event, originalValue, maskedValue) => {
              console.log(event, originalValue, maskedValue);
            }}
            InputElement={
              <Form.Item
                label="Margem"
                name="profit"
                rules={[
                  {
                    required: true,
                    message: "Insira a margem de lucro"
                  }
                ]}
              >
                <InputNumber
                  step="0.01"
                  ref={inputProfit}
                  addonBefore="R$"
                  name="profit"
                  onChange={calculateFinalPrice}
                />
              </Form.Item>
            }
          />

          <Form.Item label="Preço final (projeção)" name="finalPrice">
            <InputNumber
              name="finalPrice"
              ref={inputFinalPrice}
              addonBefore="R$"
              step="0.01"
              style={{ width: "100%" }}
              readOnly
            />
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
            <Select ref={inputStatus}>
              <Select.Option value="Em trânsito">Em trânsito</Select.Option>
              <Select.Option value="Em estoque">Em estoque</Select.Option>
              <Select.Option value="Reparo">Reparo</Select.Option>
            </Select>
          </Form.Item>
          <Button type="primary" htmlType="submit" size="large">
            Cadastrar
          </Button>
        </Col>
      </Row>
    </Form>
  );
}

export default AddItemForm;
