import { useRef } from "react";
import { Button, Form, Input, Select, Space } from "antd";
import API from "../services/api";

// eslint-disable-next-line react/prop-types
function AddItemForm({ handleGetStock }) {
  const inputImei = useRef();
  const inputModel = useRef();
  const inputColor = useRef();
  const inputCapacity = useRef();
  const inputBattery = useRef();
  const inputUnitPrice = useRef();
  const inputTax = useRef();
  const inputStatus = useRef();
  const inputDetails = useRef();

  async function AddNewItem() {
    const newItemData = {
      imei: inputImei.current.input.value,
      model: inputModel.current.input.value,
      color: inputColor.current.input.value,
      capacity: inputCapacity.current.input.value,
      battery: inputBattery.current.input.value,
      unitPrice: parseFloat(inputUnitPrice.current.input.value),
      tax: parseFloat(inputTax.current.input.value),
      status: inputStatus.current.nativeElement.innerText,
      details: inputDetails.current.input.value,
      isAvailable: true
    };
    await API.post("/stock", newItemData)
      .then((res) => {
        handleGetStock();
        console.log("res ---> ", res.data.message);
      })
      .catch((err) => {
        console.log("err ---> ", err.message);
      });
  }

  return (
    <Space>
      <Form
        name="AddItem"
        labelCol={{ span: 16 }}
        wrapperCol={{ span: 36 }}
        layout="vertical"
        style={{
          display: "flex",
          flexDirection: "row",
          gap: 16
        }}
      >
        <Form.Item
          label="IMEI"
          rules={[
            {
              required: true,
              message: "Insira um IMEI válido"
            }
          ]}
        >
          <Input name="imei" ref={inputImei} />
        </Form.Item>
        <Form.Item
          label="Modelo"
          rules={[
            {
              required: true,
              message: "Insira o modelo do item"
            }
          ]}
        >
          <Input name="model" ref={inputModel} />
        </Form.Item>
        <Form.Item
          label="Cor"
          rules={[
            {
              required: true,
              message: "Insira a cor do item"
            }
          ]}
        >
          <Input name="color" ref={inputColor} />
        </Form.Item>
        <Form.Item
          label="Capacidade"
          rules={[
            {
              required: true,
              message: "Insira a capacidade em GB"
            }
          ]}
        >
          <Input name="capacity" ref={inputCapacity} type="number" />
        </Form.Item>
        <Form.Item
          label="Bateria"
          rules={[
            {
              required: true,
              message: "Insira o estado da bateria"
            }
          ]}
        >
          <Input name="battery" ref={inputBattery} type="number" />
        </Form.Item>
        <Form.Item
          label="Custo"
          rules={[
            {
              required: true,
              message: "Insira o custo unitário"
            }
          ]}
        >
          <Input name="unitPrice" ref={inputUnitPrice} type="number" />
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
          <Input name="tax" ref={inputTax} type="number" />
        </Form.Item>
        <Form.Item
          label="Status"
          rules={[
            {
              required: true,
              message: "Insira o status do item"
            }
          ]}
        >
          <Select name="status" ref={inputStatus}>
            <Select.Option value="Em trânsito">Em trânsito</Select.Option>
            <Select.Option value="Em estoque">Em estoque</Select.Option>
            <Select.Option value="Reparo">Assistência Técnica</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item
          label="Detalhes"
          rules={[
            {
              message: "Insira o detalhe do item"
            }
          ]}
        >
          <Input name="details" ref={inputDetails} />
        </Form.Item>
        <Button type="primary" htmlType="submit" onClick={AddNewItem}>
          Cadastrar
        </Button>
      </Form>
    </Space>
  );
}

export default AddItemForm;
