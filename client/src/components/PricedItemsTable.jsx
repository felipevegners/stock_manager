/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useContext, useEffect, useState } from "react";
import {
  Divider,
  Form,
  Input,
  InputNumber,
  Popconfirm,
  Space,
  Table,
  Tooltip,
  Typography
} from "antd";
import { currencyHelper } from "../helpers/CurrencyHelper";
import { OrderContext } from "../pages/Orders/OrderContext";
import { CloseOutlined, EditOutlined, SaveOutlined } from "@ant-design/icons";

const PricedItemsTable = () => {
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
      inputType === "number" ? (
        <InputNumber
          controls={false}
          onBlur={() => save(record.id)}
          onPressEnter={() => save(record.id)}
          style={{ width: 180 }}
          addonBefore="R$"
        />
      ) : (
        <Input />
      );
    return (
      <td {...restProps}>
        {editing ? (
          <Space>
            <Form.Item
              name={dataIndex}
              style={{
                margin: 0
              }}
              rules={[
                {
                  required: true,
                  message: `Insira o valor de venda!`
                }
              ]}
            >
              {inputNode}
            </Form.Item>
            <Tooltip title="Salvar">
              <SaveOutlined
                onClick={() => save(record.id)}
                style={{ color: "#1677FF" }}
              >
                Salvar
              </SaveOutlined>
            </Tooltip>
            <Tooltip title="Cancelar">
              <CloseOutlined onClick={cancel}>Cancelar</CloseOutlined>
            </Tooltip>
          </Space>
        ) : (
          children
        )}
      </td>
    );
  };

  const { selectedItems } = useContext(OrderContext);

  const [form] = Form.useForm();
  const [data, setData] = useState(selectedItems);
  const [editingKey, setEditingKey] = useState("");
  const isEditing = (record) => record.id === editingKey;
  const edit = (record) => {
    form.setFieldsValue({
      sellPrice: 0,
      ...record
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
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };

  const itemsColumns = [
    {
      title: "IMEI",
      dataIndex: "imei",
      width: 120
    },
    {
      title: "Produto",
      dataIndex: ["model", "color", "capacity", "battery", "details"],
      width: "25%",
      render: (_, record) => {
        return (
          <p>
            {record.model} - {record.capacity}
            GB - {record.color} - Bateria {record.battery}%{" "}
            {record.details === null ? "(Sem detalhes)" : `(${record.details})`}
          </p>
        );
      }
    },
    {
      title: "Preço Custo",
      dataIndex: "totalCosts",
      width: 185,
      render: (text) => {
        return currencyHelper(text);
      }
    },
    {
      title: "Valor Venda",
      dataIndex: "sellPrice",
      width: 185,
      editable: true,
      render: (_, record) => {
        return record.sellPrice !== null ? (
          <>
            {currencyHelper(record.sellPrice)}
            <Divider type="vertical" />
            <Tooltip title="Editar valor">
              <EditOutlined
                disabled={editingKey !== ""}
                onClick={() => edit(record)}
                style={{ color: "#1677FF" }}
              />
            </Tooltip>
          </>
        ) : (
          <Typography.Link
            disabled={editingKey !== ""}
            onClick={() => edit(record)}
          >
            Inserir valor
          </Typography.Link>
        );
      }
    },
    {
      title: "Lucro",
      width: 185,
      render: (record) => {
        return record.sellPrice === 0
          ? ""
          : currencyHelper(record.sellPrice - record.totalCosts);
      }
    }
  ];

  const mergedColumns = itemsColumns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: col.dataIndex === "sellPrice" ? "number" : "text",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record)
      })
    };
  });

  useEffect(() => {
    setData(selectedItems);
  }, [selectedItems]);

  return (
    <Form form={form} component={false}>
      <Table
        components={{
          body: {
            cell: EditableCell
          }
        }}
        bordered
        dataSource={data}
        columns={mergedColumns}
        rowClassName="editable-row"
        rowKey={(record) => record.id}
      />
    </Form>
  );
};
export default PricedItemsTable;
