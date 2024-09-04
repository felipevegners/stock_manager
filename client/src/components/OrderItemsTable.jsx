/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useContext, useEffect, useRef, useState } from "react";
import {
  Button,
  Form,
  Input,
  InputNumber,
  Popconfirm,
  Space,
  Table,
  Typography
} from "antd";
import { currencyHelper } from "../helpers/CurrencyHelper";
import { currencyFormatter } from "../helpers/CurrencyFormatter";
import "../pages/Orders/styles.css";
const EditableContext = React.createContext(null);
const EditableRow = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};
const EditableCell = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef(null);
  const form = useContext(EditableContext);
  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({
      [dataIndex]: record[dataIndex]
    });
  };

  const save = async () => {
    try {
      const values = await form.validateFields();
      toggleEdit();
      handleSave({
        ...record,
        ...values
      });
    } catch (errInfo) {
      console.log("Save failed:", errInfo);
    }
  };

  let childNode = children;
  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{
          margin: 0
        }}
        name={dataIndex}
        rules={[
          {
            required: true,
            message: "Insira o valor de venda."
          }
        ]}
      >
        <Input
          addonBefore="R$"
          ref={inputRef}
          onPressEnter={save}
          onBlur={save}
          controls={false}
          value={""}
          style={{ maxWidth: 180 }}
        />
      </Form.Item>
    ) : (
      <div className="editable-cell-value-wrap" onClick={toggleEdit}>
        {children}
      </div>
    );
  }
  return <td {...restProps}>{childNode}</td>;
};

const OrderItemsTable = ({ items }) => {
  const [dataSource, setDataSource] = useState(items);

  const finalColumns = [
    {
      title: "Produto",
      dataIndex: ["imei", "model", "color", "capacity", "battery"],
      width: "30%",
      render: (_, record) => {
        return (
          <Typography.Text>
            IMEI {record.imei} - {record.model} - {record.capacity} GB -{" "}
            {record.color} - Bateria {record.battery}%
          </Typography.Text>
        );
      }
    },
    {
      title: "Detalhes",
      width: "30%",
      dataIndex: "details"
    },
    {
        title: "Preço Custo",
        width: "12%",
      render: (record) => {
        return currencyHelper(record.totalCosts);
      }
    },
    {
      title: "Valor Venda",
      dataIndex: "sellPrice",
      editable: true,
      width: "12%",
      render: (text) => {
        return currencyHelper(text);
      }
    },
    {
      title: "Lucro",
      width: "16%",
      render: (record) => {
        return record.sellPrice === 0
          ? ""
          : currencyHelper(record.sellPrice - record.totalCosts);
      }
    }
  ];

  const handleSave = (row) => {
    const newData = [...dataSource];
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row
    });
    setDataSource(newData);
  };
  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell
    }
  };
  const columns = finalColumns?.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave
      })
    };
  });

  useEffect(() => {
    setDataSource(items);
  }, [items]);

  return (
    <>
      <Table
        components={components}
        rowClassName={() => "editable-row"}
        bordered
        dataSource={dataSource}
        columns={columns}
      />
    </>
  );
};
export default OrderItemsTable;
