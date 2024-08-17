import { useRef } from "react";
import { Button, Form, Input, Select, message } from "antd";
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
  const inputStatus = useRef();
  const inputDetails = useRef();

  const [form] = Form.useForm();

  const addNewItem = () => {
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
    createItem(newItemData).then((result) => {
      if (result?.response?.status === 400)
        message.error("Produto não cadastrado. Verifique os dados inseridos.");
      else {
        message.success(result.message);
      }
    });
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
      labelCol={{ span: 16 }}
      wrapperCol={{ span: 26 }}
      layout="vertical"
      onFinish={onFinish}
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: 16
      }}
    >
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
        label="Custo"
        name="unitPrice"
        rules={[
          {
            required: true,
            message: "Insira o custo unitário"
          }
        ]}
      >
        <Input ref={inputUnitPrice} type="number" />
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
          <Select.Option value="Reparo">Assistência Técnica</Select.Option>
        </Select>
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
      <Button type="primary" htmlType="submit">
        Cadastrar
      </Button>
    </Form>
  );
}

export default AddItemForm;
