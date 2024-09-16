/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import {
  Divider,
  Table,
  Typography,
  InputNumber,
  Input,
  Form,
  Popconfirm
} from "antd";
import { BatchContext } from "../pages/Batch/BatchContext";
import { useContext, useEffect, useState } from "react";

import { currencyHelper } from "../helpers/CurrencyHelper";
import { QuestionCircleOutlined } from "@ant-design/icons";
import MaskedInput from "./MaskedInput";

const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  const inputNode =
    inputType === "money" ? (
      <MaskedInput customInput={Input} type="numeric" prefix="R$" width={140} />
    ) : inputType === "number" ? (
      <InputNumber />
    ) : (
      <Input />
    );
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{
            margin: 0
          }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`
            }
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

function BatchesTable({ batches }) {
  const { isLoading, upDateBatchData, removeBatch } = useContext(BatchContext);

  const [form] = Form.useForm();
  const [data, setData] = useState(batches);
  const [editingKey, setEditingKey] = useState("");
  const isEditing = (record) => record.id === editingKey;

  const edit = (record) => {
    form.setFieldsValue({
      batchName: record.batchName,
      batchDate: record.batchDate,
      batchQty: record.batchQty,
      batchTax: record.batchTax,
      batchFreight: record.batchFreight,
      batchBoyPrice: record.batchBoyPrice
    });
    setEditingKey(record.id);
  };

  const cancel = () => {
    setEditingKey("");
  };

  const save = async (key) => {
    try {
      const row = await form.validateFields();

      const newData = [...data];
      const index = newData.findIndex((item) => key === item.id);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row
        });
        setData(newData);
        setEditingKey("");
      } else {
        newData.push(row);
        setData(newData);
        setEditingKey("");
      }

      upDateBatchData(editingKey, row);
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };

  const batchColums = [
    {
      title: "Nome do Lote",
      dataIndex: "batchName",
      editable: true
    },
    {
      title: "Data de Entrada",
      dataIndex: "batchDate",
      editable: true
    },
    {
      title: "QTD Itens",
      dataIndex: "batchQty",
      editable: true
    },
    {
      title: "Taxa U$D",
      dataIndex: "batchTax",
      editable: true,
      render: (text) => {
        return currencyHelper(text);
      }
    },
    {
      title: "Frete",
      dataIndex: "batchFreight",
      editable: true,
      render: (text) => {
        return currencyHelper(text);
      }
    },
    {
      title: "Motoboy",
      dataIndex: "batchBoyPrice",
      editable: true,
      render: (text) => {
        return currencyHelper(text);
      }
    },
    {
      title: "Ações",
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Typography.Link
              onClick={() => save(record.id)}
              style={{
                marginInlineEnd: 8
              }}
            >
              Salvar
            </Typography.Link>
            <Divider type="vertical" />
            <Popconfirm
              title="Cancelar alteração de lote?"
              icon={
                <QuestionCircleOutlined
                  style={{
                    color: "red"
                  }}
                />
              }
              cancelText="Não"
              okText="Sim"
              okType="primary"
              onConfirm={cancel}
              okButtonProps={{
                loading: isLoading,
                danger: true
              }}
            >
              <a>Cancelar</a>
            </Popconfirm>
          </span>
        ) : (
          <>
            <Typography.Link
              disabled={editingKey !== ""}
              onClick={() => edit(record)}
            >
              Editar
            </Typography.Link>
            <Divider type="vertical" />
            <Typography.Link
              disabled={true}
              onClick={() => removeBatch(record.id)}
              style={{ color: "red", opacity: 0.5 }}
            >
              Excluir
            </Typography.Link>
          </>
        );
      }
    }
  ];

  useEffect(() => {
    setData(batches);
  }, [batches]);

  const mergedColumns = batchColums.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType:
          col.dataIndex === "batchQty"
            ? "number"
            : col.dataIndex === "batchTax"
            ? "money"
            : col.dataIndex === "batchFreight"
            ? "money"
            : col.dataIndex === "batchBoyPrice"
            ? "money"
            : "text",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record)
      })
    };
  });
  return (
    <Form form={form} component={false}>
      <Table
        components={{
          body: {
            cell: EditableCell
          }
        }}
        dataSource={data}
        columns={mergedColumns}
        pagination={false}
        loading={isLoading}
        rowClassName="editable-row"
        rowKey={(record) => record.id}
      />
    </Form>
  );
}

export default BatchesTable;
