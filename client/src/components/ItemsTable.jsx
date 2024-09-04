/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import {
  Form,
  Input,
  InputNumber,
  Popconfirm,
  Table,
  Typography,
  message,
  Divider,
  Select,
  Badge
} from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";
import { deleteItem, updateItem } from "../controllers/ItemController";
import { currencyHelper } from "../helpers/CurrencyHelper";

const statusOptions = [
  {
    value: "Em estoque",
    label: "Em estoque"
  },
  {
    value: "Em trânsito",
    label: "Em trânsito"
  },
  {
    value: "Reparo",
    label: "Reparo"
  }
];

const selectStatus = (record) => {
  const filteredStatus = statusOptions.filter(
    (data) => data.value !== record.status
  );
  return filteredStatus;
};

const EditableCell = ({
  children,
  dataIndex,
  editing,
  inputType,
  title,
  record,
  ...restProps
}) => {
  const inputNode =
    inputType === "number" ? (
      <InputNumber />
    ) : inputType === "select" ? (
      <Select options={selectStatus(record)} />
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
              message: `Insira ${title}`
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
const ItemsTable = ({ tableData, fetchData }) => {
  const [form] = Form.useForm();
  const [data, setData] = useState(tableData);
  const [editingKey, setEditingKey] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const isEditing = (record) => record.id === editingKey;

  const edit = (record) => {
    form.setFieldsValue({
      imei: record.imei,
      model: record.model,
      color: record.color,
      capacity: record.capacity,
      battery: record.battery,
      details: record.details,
      itemCosts: parseFloat(record.itemCosts, 2),
      status: record.status,
      isAvailable: record.isAvailable
    });
    setEditingKey(record.id);
  };

  const cancel = () => {
    setEditingKey("");
  };

  const save = async (key) => {
    try {
      let row = await form.validateFields();
      if (row.status === "Reparo" || row.status === "Em trânsito") {
        row = { ...row, isAvailable: false };
      } else row = { ...row, isAvailable: true };

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

      updateItem(editingKey, row).then((result) => {
        if (result?.response?.status === 400) {
          message.error(
            "Produto não atualizado. Verifique os dados inseridos."
          );
        } else {
          message.success(result.message);
          setTimeout(() => {
            fetchData();
          }, 1000);
        }
      });
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };

  const removeItem = async (id) => {
    setIsLoading(true);
    deleteItem(id).then((result) => {
      message.success(result.message);
    });
    setTimeout(() => {
      setIsLoading(false);
      fetchData();
    }, 1000);
  };

  const columns = [
    {
      title: "Lote",
      dataIndex: "batch",
      editable: false,
      width: 100,
      fixed: "left",
      render: (text) => {
        return <>{text?.name}</>;
      }
    },
    {
      title: "IMEI",
      dataIndex: "imei",
      editable: true,
      width: "10%"
    },
    {
      title: "Modelo",
      dataIndex: "model",
      editable: true,
      with: "8%"
    },
    {
      title: "Cor",
      dataIndex: "color",
      editable: true,
      width: "8%"
    },
    {
      title: "Capacidade",
      dataIndex: "capacity",
      editable: true,
      width: "5%"
    },
    {
      title: "Bateria",
      dataIndex: "battery",
      editable: true,
      width: "5%"
    },
    {
      title: "Detalhes",
      dataIndex: "details",
      editable: true,
      width: "10%"
    },
    {
      title: "Custo USD",
      dataIndex: "itemCosts",
      editable: false,
      render: (text) => {
        return <>{currencyHelper(text, "en-US", "USD")}</>;
      }
    },
    {
      title: "Custo Total",
      dataIndex: "totalCosts",
      editable: false,
      render: (text) => {
        return <>{currencyHelper(text)}</>;
      }
    },
    {
      title: "Status",
      dataIndex: "status",
      editable: true,
      width: "8%",
      render: (text) => {
        return (
          <Badge
            status={
              text === "Em trânsito"
                ? "warning"
                : text === "Reparo"
                ? "error"
                : text === "Pendente"
                ? "processing"
                : text === "Vendido"
                ? "default"
                : "success"
            }
            text={text}
          />
        );
      }
    },
    {
      title: "Ação",
      dataIndex: "operation",
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <>
            <Typography.Link onClick={() => save(record.id)}>
              Salvar
            </Typography.Link>
            <Divider type="vertical" />
            <Typography.Link
              onClick={cancel}
              style={{
                marginInlineEnd: 8
              }}
            >
              Cancelar
            </Typography.Link>
          </>
        ) : (
          <>
            {record.status === "Pendente" ? (
              ""
            ) : record.status === "Vendido" ? (
              <>
                {" "}
                <Popconfirm
                  title="Excluir produto"
                  description="Tem certeza da exclusão?"
                  icon={
                    <QuestionCircleOutlined
                      style={{
                        color: "red"
                      }}
                    />
                  }
                  cancelText="Cancelar"
                  okText="Sim"
                  okType="primary"
                  onConfirm={() => removeItem(record.id)}
                  okButtonProps={{
                    loading: isLoading,
                    danger: true
                  }}
                >
                  <a>Excluir</a>
                </Popconfirm>
              </>
            ) : (
              <>
                {" "}
                <Typography.Link
                  disabled={editingKey !== ""}
                  onClick={() => edit(record)}
                >
                  Editar
                </Typography.Link>
                <Divider type="vertical" />
                <Popconfirm
                  title="Excluir produto"
                  description="Tem certeza da exclusão?"
                  icon={
                    <QuestionCircleOutlined
                      style={{
                        color: "red"
                      }}
                    />
                  }
                  cancelText="Cancelar"
                  okText="Sim"
                  okType="primary"
                  onConfirm={() => removeItem(record.id)}
                  okButtonProps={{
                    loading: isLoading,
                    danger: true
                  }}
                >
                  <a>Excluir</a>
                </Popconfirm>
              </>
            )}
          </>
        );
      }
    }
  ];

  useEffect(() => {
    setData(tableData);
  }, [tableData]);

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType:
          col.dataIndex === "unitPrice"
            ? "number"
            : col.dataIndex === "tax"
            ? "number"
            : col.dataIndex === "profit"
            ? "number"
            : col.dataIndex === "finalPrice"
            ? "number"
            : col.dataIndex === "status"
            ? "select"
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
        bordered
        dataSource={data}
        columns={mergedColumns}
        rowClassName="editable-row"
        pagination={{
          onChange: cancel,
          position: ["bottomCenter"]
        }}
        rowKey={(record) => record.id}
      />
    </Form>
  );
};
export default ItemsTable;
