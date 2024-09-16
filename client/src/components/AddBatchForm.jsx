/* eslint-disable no-unused-vars */
import { useContext, useState } from "react";
import { Button, Col, Form, Input, InputNumber, Row, DatePicker } from "antd";
import { BatchContext } from "../pages/Batch/BatchContext";
import MaskedInput from "./MaskedInput";

function AddBatchForm() {
  const { createNewBatch, fetchData } = useContext(BatchContext);
  const [isEditBatchMode, setIsEditBatchMode] = useState(false);

  const [form] = Form.useForm();

  const handleBatchData = (value) => {
    const newBatch = {
      batchName: value["batchName"],
      batchDate: value["batchDate"].format("DD/MM/YYYY"),
      batchQty: value["batchQty"],
      batchTax: value["batchTax"],
      batchFreight: value["batchFreight"],
      batchBoyPrice: value["batchBoyPrice"]
    };

    if (isEditBatchMode) {
      console.log("Editando Lote!!!");
    } else {
      createNewBatch(newBatch);
    }
  };

  const onFinish = (value) => {
    handleBatchData(value);
    setTimeout(() => {
      fetchData();
      form.resetFields();
    }, 1000);
  };

  return (
    <>
      <Form
        form={form}
        layout="vertical"
        labelCol={{ span: 14 }}
        wrapperCol={{ span: 18 }}
        onFinish={onFinish}
      >
        <Row>
          <Col span={24}>
            <Form.Item
              label="Nome do Lote"
              name="batchName"
              rules={[
                {
                  required: true,
                  message: "Insira um nome válido"
                }
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Data de Entrada"
              name="batchDate"
              rules={[
                {
                  required: true,
                  message: "Selecione a data"
                }
              ]}
            >
              <DatePicker locale={"pt_BR"} format={"DD/MM/YYYY"} />
            </Form.Item>
            <Form.Item
              label="QTD de Itens"
              name="batchQty"
              rules={[
                {
                  required: true,
                  message: "Insira a qtd de items"
                }
              ]}
            >
              <InputNumber />
            </Form.Item>
            <Form.Item
              label="Taxa Dólar"
              name="batchTax"
              rules={[
                {
                  required: true,
                  message: "Insira a taxa negociada"
                }
              ]}
            >
              <MaskedInput customInput={Input} type="numeric" prefix="R$" />
            </Form.Item>
            <Form.Item
              label="Frete"
              name="batchFreight"
              rules={[
                {
                  required: true,
                  message: "Insira o valor do frete"
                }
              ]}
            >
              <MaskedInput customInput={Input} type="numeric" prefix="R$" />
            </Form.Item>
            <Form.Item
              label="Custos Motoboy"
              name="batchBoyPrice"
              rules={[
                {
                  required: true,
                  message: "Insira um valor"
                }
              ]}
            >
              <MaskedInput customInput={Input} type="numeric" prefix="R$" />
            </Form.Item>
            <Button type="primary" htmlType="submit" size="large">
              Salvar Lote
            </Button>
          </Col>
        </Row>
      </Form>
    </>
  );
}

export default AddBatchForm;
