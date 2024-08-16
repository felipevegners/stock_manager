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
  Space
} from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";
import { deleteItem, updateItem } from "../../controllers/ItemController";

const EditableCell = ({
  children,
  dataIndex,
  editing,
  inputType,
  title,
  ...restProps
}) => {
  const inputNode = inputType === "number" ? <InputNumber /> : <Input />;
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
const CustomersTable = ({ tableData, fetchData }) => {
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
      unitPrice: parseFloat(record.unitPrice),
      tax: parseFloat(record.tax),
      status: record.status
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
      title: "Nome",
      dataIndex: "name",
      editable: true,
      width: "10%"
    },
    {
      title: "Telefone",
      dataIndex: "phone",
      editable: true,
      with: "5%"
    },
    {
      title: "E-mail",
      dataIndex: "email",
      editable: true,
      width: "10%"
    },
    {
      title: "Endereço",
      dataIndex: [
        "street",
        "stNumber",
        "stComplement",
        "city",
        "state",
        "zipCode"
      ],
      editable: true,
      width: "30%",
      render: (text, record) => {
        return (
          <Typography.Text>
            Rua {record.street}, {record.stNumber}{" "}
            {record.stComplement.length > 0 ? ` - ${record.stComplement}` : ""}{" "}
            - {record.city} - {record.state} - CEP {record.zipCode}
          </Typography.Text>
        );
      }
    },
    {
      title: "Observações",
      dataIndex: "observations",
      editable: true,
      width: "20%",
      render: (text) => {
        return <>{text}</>;
      }
    },
    {
      title: "Ações",
      dataIndex: "operation",
      with: "5%",
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <Space split={<Divider type="vertical" />}>
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
          </Space>
        ) : (
          <>
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
              okType="danger"
              onOpenChange={() => console.log("open change")}
              onConfirm={() => removeItem(record.id)}
              okButtonProps={{
                loading: isLoading
              }}
            >
              <a>Excluir</a>
            </Popconfirm>
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
export default CustomersTable;
