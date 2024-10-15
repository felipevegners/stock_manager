/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";
import {
  Button,
  Col,
  Divider,
  Flex,
  Form,
  Input,
  InputNumber,
  message,
  Radio,
  Row,
  Space
} from "antd";
import {
  createCustomer,
  updateCustomer
} from "../controllers/CustomerController";
import { MaskedInput } from "antd-mask-input";

const { TextArea } = Input;

function AddCustomerForm({
  fetchData,
  setShowAddNewCustomer,
  customerDataToEdit,
  handleCancel
}) {
  const [documentType, setDocumentType] = useState("");

  const inputName = useRef();
  const inputDocument = useRef();
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

  const handleCustomerData = () => {
    const newCustomerData = {
      name: inputName.current.input.value,
      document: inputDocument.current.value,
      phone: inputPhone.current.input.value,
      email: inputEmail.current.input.value,
      street: inputStreet.current.input.value,
      stNumber: inputStNumber.current.input.value,
      stComplement: inputStComplement.current.input.value,
      city: inputCity.current.input.value,
      state: inputState.current.input.value,
      zipCode: inputZipCode.current.input.value,
      observations: inputObservations.current.resizableTextArea.textArea.value
    };

    if (customerDataToEdit) {
      const { id } = customerDataToEdit;

      updateCustomer(id, newCustomerData).then((result) => {
        if (result?.response?.status === 400) {
          message.error(
            "Cadastro não atualizado. Verifique os dados inseridos."
          );
        } else {
          message.success(result.message);
          handleCancel();
          form.resetFields();
        }
      });
    } else {
      createCustomer(newCustomerData).then((result) => {
        if (result?.response?.status === 400) {
          console.log(result);
          message.error(
            "Cliente não cadastrado. Verifique os dados inseridos."
          );
        } else {
          message.success(result.message);
          form.resetFields();
          setShowAddNewCustomer(false);
        }
      });
    }
  };

  const handleDocument = (event) => {
    form.setFieldsValue({ document: "" });
    const { value } = event.target;
    setDocumentType(value);
  };

  const updateFormValues = () => {
    form.setFieldsValue({
      ...customerDataToEdit
    });
  };

  const onFinish = () => {
    handleCustomerData();
    setTimeout(() => {
      fetchData();
    }, 1000);
  };

  useEffect(() => {
    if (customerDataToEdit) {
      updateFormValues();
    }
  }, [customerDataToEdit]);

  return (
    <>
      <Form form={form} layout="vertical" onFinish={onFinish} size="large">
        <Row
          gutter={{
            xs: 8,
            sm: 16,
            md: 24,
            lg: 32
          }}
        >
          <Col span={12}>
            <h2>Dados pessoais</h2>
            <Divider />
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
            <Space direction="vertical">
              <Flex vertical gap="middle">
                <Radio.Group
                  onChange={handleDocument}
                  value={documentType}
                  size="small"
                >
                  <Radio.Button value={"cpf"}>CPF</Radio.Button>
                  <Radio.Button value={"cnpj"}>CNPJ</Radio.Button>
                </Radio.Group>
              </Flex>
              <Form.Item
                label="Documento"
                name="document"
                rules={[
                  {
                    required: true,
                    message: "Insira um documento válido"
                  }
                ]}
              >
                {documentType === "cpf" ? (
                  <InputNumber
                    ref={inputDocument}
                    formatter={(value) =>
                      value.replace(
                        /(\d{3})(\d{3})(\d{3})(\d{2})/g,
                        "$1.$2.$3-$4"
                      )
                    }
                    style={{ width: 180 }}
                    maxLength={14}
                    controls={false}
                  />
                ) : (
                  <InputNumber
                    ref={inputDocument}
                    formatter={(value) =>
                      value.replace(
                        /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/g,
                        "$1.$2.$3/$4-$5"
                      )
                    }
                    style={{ width: 180 }}
                    maxLength={18}
                    controls={false}
                  />
                )}
              </Form.Item>
            </Space>
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
              <MaskedInput
                ref={inputPhone}
                mask={"(00) 00000-0000"}
                className="ant-input ant-input-lg css-dev-only-do-not-override-d2lrxs ant-input-outlined ant-input-status-success"
              />
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
            <Form.Item label="Observações" name="observations">
              <TextArea ref={inputObservations} rows={2} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <h2>Endereço</h2>
            <Divider />
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
                <Input ref={inputStNumber} />
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
              <MaskedInput
                ref={inputZipCode}
                mask={"00000-000"}
                className="ant-input ant-input-lg css-dev-only-do-not-override-d2lrxs ant-input-outlined ant-input-status-success"
              />
            </Form.Item>
            {customerDataToEdit ? (
              <Button
                type="primary"
                htmlType="submit"
                style={{ float: "right" }}
              >
                Atualizar Cadastro
              </Button>
            ) : (
              <Button
                type="primary"
                htmlType="submit"
                style={{ float: "right" }}
              >
                Cadastrar cliente
              </Button>
            )}
          </Col>
        </Row>
      </Form>
    </>
  );
}

export default AddCustomerForm;
