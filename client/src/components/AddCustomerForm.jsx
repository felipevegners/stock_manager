import { useRef } from "react";
import { Button, Divider, Form, Input, message } from "antd";
import { createItem } from "../controllers/ItemController";

const { TextArea } = Input;

// eslint-disable-next-line react/prop-types
function AddCustomerForm({ fetchData }) {
  const inputName = useRef();
  const inputPhone = useRef();
  const inputEmail = useRef();
  const inputStreet = useRef();
  const inputStNumber = useRef();
  const inputStComplement = useRef();
  const inputCity = useRef();
  const inputState = useRef();
  const inputZipCode = useRef();
  const inputObservations = useRef();

  const [form] = Form.useForm();

  const addNewCustomer = () => {
    const newItemData = {
      name: inputName.current.input.value,
      phone: inputPhone.current.input.value,
      email: inputEmail.current.input.value,
      street: inputStreet.current.input.value,
      stNumber: parseFloat(inputStNumber.current.input.value),
      stComplement: inputStComplement.current.input.value,
      city: inputCity.current.input.value,
      state: inputState.current.input.value,
      zipCode: inputZipCode.current.input.value,
      observations: inputObservations.current.input.value
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
    addNewCustomer();
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
        width: 400
      }}
    >
      <Form.Item
        label="Nome"
        name="name"
        rules={[
          {
            required: true,
            message: "Insira um nome"
          }
        ]}
      >
        <Input ref={inputName} />
      </Form.Item>
      <Form.Item
        label="Telefone"
        name="phone"
        rules={[
          {
            required: true,
            message: "Insira um telefone"
          }
        ]}
      >
        <Input ref={inputPhone} />
      </Form.Item>
      <Form.Item
        label="E-mail"
        name="email"
        rules={[
          {
            required: true,
            message: "Insira um email"
          }
        ]}
      >
        <Input ref={inputEmail} />
      </Form.Item>
      <Divider />
      <h2>Endereço</h2>
      <br />
      <Form.Item
        label="Rua"
        name="street"
        rules={[
          {
            required: true,
            message: "Insira o nome da rua"
          }
        ]}
      >
        <Input ref={inputStreet} />
      </Form.Item>
      <Form.Item style={{ marginBottom: 0 }}>
        <Form.Item
          label="Número"
          name="stNumber"
          rules={[
            {
              required: true,
              message: "Insira o número"
            }
          ]}
          style={{
            display: "inline-block",
            width: "calc(50% - 8px)"
          }}
        >
          <Input ref={inputStNumber} type="number" />
        </Form.Item>
        <Form.Item
          label="Complemento"
          name="stComplement"
          rules={[
            {
              message: "Insira o complemento"
            }
          ]}
          style={{
            display: "inline-block",
            width: "calc(50% - 8px)",
            margin: "0 8px"
          }}
        >
          <Input ref={inputStComplement} />
        </Form.Item>
      </Form.Item>

      <Form.Item style={{ marginBottom: 0 }}>
        <Form.Item
          label="Cidade"
          name="city"
          rules={[
            {
              message: "Insira a cidade"
            }
          ]}
          style={{
            display: "inline-block",
            width: "calc(50% - 8px)"
          }}
        >
          <Input ref={inputCity} />
        </Form.Item>
        <Form.Item
          label="Estado"
          name="state"
          style={{
            display: "inline-block",
            width: "calc(50% - 8px)",
            margin: "0 8px"
          }}
        >
          <Input ref={inputState} />
        </Form.Item>
      </Form.Item>
      <Form.Item
        label="CEP"
        name="zipCode"
        rules={[
          {
            message: "Insira o CEP"
          }
        ]}
      >
        <Input ref={inputZipCode} />
      </Form.Item>
      <Form.Item label="Observações" name="observations">
        <TextArea ref={inputZipCode} rows={2} />
      </Form.Item>
      <Button type="primary" htmlType="submit">
        Cadastrar
      </Button>
    </Form>
  );
}

export default AddCustomerForm;
