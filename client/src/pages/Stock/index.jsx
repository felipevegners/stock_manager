import { useEffect, useState } from "react";
import {
  Table,
  Input,
  Select,
  Space,
  Divider,
  Tooltip,
  Alert,
  Button,
  Card,
  Form,
  message
} from "antd";
import {
  CheckSquareOutlined,
  CloseSquareOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined
} from "@ant-design/icons";
import AddItemForm from "../../components/AddItemForm";
import { getItems, deleteItem } from "../../controllers/ItemController";
import { AxiosError } from "axios";
import Link from "antd/es/typography/Link";

const { Option } = Select;
const { Search } = Input;

function Stock() {
  const [stock, setStock] = useState([]);
  const [searchFor, setSearchFor] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchMode, setSearchMode] = useState(false);
  const [viewAddNewItem, setViewAddNewItem] = useState(false);
  const [idToEdit, setIdToEdit] = useState(null);
  const [isEditMode, setIsEditMode] = useState(true);

  const [form] = Form.useForm();

  const handleViewAddNew = () => {
    setViewAddNewItem(true);
  };

  const handleSearch = (value, _e, info) => {
    const searchParams = { [searchFor]: value };

    if (info?.source === "input" && value !== "") {
      getItems(searchParams).then((result) => setStock(result));
      setSearchTerm(value);
      setSearchMode(true);
    } else if (info?.source === "input" && value === "") {
      console.log("digite uma busca válida");
    } else {
      setSearchMode(false);
      getItems().then((result) => setStock(result));
    }
  };

  const translateSearchFor = (term) => {
    if (term === "imei") return "IMEI";
    if (term === "model") return "Modelo";
    if (term === "color") return "Cor";
    if (term === "capacity") return "Capacidade";
    if (term === "battery") return "Bateria";

    return term;
  };

  const selectOptions = (
    <Select
      placeholder="Buscar por"
      style={{ width: 150 }}
      onSelect={(value) => {
        setSearchFor(value);
      }}
    >
      <Option value="imei">IMEI</Option>
      <Option value="model">Modelo</Option>
      <Option value="color">Cor</Option>
      <Option value="capacity">Capacidade</Option>
      <Option value="battery">Bateria</Option>
    </Select>
  );

  const columns = [
    {
      title: "IMEI",
      dataIndex: "imei",
      render: (text, record) => {
        if (idToEdit === record.id) {
          return (
            <Form.Item
              name="imei"
              rules={[
                {
                  required: true,
                  message: "Insira um IMEI válido"
                }
              ]}
              style={{ marginBottom: 0 }}
            >
              <Input />
            </Form.Item>
          );
        } else {
          return <>{text}</>;
        }
      }
    },
    {
      title: "Modelo",
      dataIndex: "model",
      render: (text, record) => {
        if (idToEdit === record.id) {
          return (
            <Form.Item
              name="model"
              rules={[
                {
                  required: true,
                  message: "Insira o nome do produto"
                }
              ]}
              style={{ marginBottom: 0 }}
            >
              <Input />
            </Form.Item>
          );
        } else {
          return <>{text}</>;
        }
      }
    },
    {
      title: "Cor",
      dataIndex: "color",
      render: (text, record) => {
        if (idToEdit === record.id) {
          return (
            <Form.Item
              name="color"
              rules={[
                {
                  required: true,
                  message: "Insira a cor do produto"
                }
              ]}
              style={{ marginBottom: 0 }}
            >
              <Input />
            </Form.Item>
          );
        } else {
          return <>{text}</>;
        }
      }
    },
    {
      title: "Capacidade",
      dataIndex: "capacity",
      render: (text, record) => {
        if (idToEdit === record.id) {
          return (
            <Form.Item
              name="capacity"
              rules={[
                {
                  required: true,
                  message: "Insira a capacidade em GB"
                }
              ]}
              style={{ marginBottom: 0 }}
            >
              <Input />
            </Form.Item>
          );
        } else {
          return <>{text} GB</>;
        }
      }
    },
    {
      title: "Bateria",
      dataIndex: "battery",
      render: (text, record) => {
        if (idToEdit === record.id) {
          return (
            <Form.Item
              name="battery"
              rules={[
                {
                  required: true,
                  message: "Insira a % da bateria"
                }
              ]}
              style={{ marginBottom: 0 }}
            >
              <Input />
            </Form.Item>
          );
        } else {
          return <>{text}%</>;
        }
      }
    },
    {
      title: "Detalhes",
      dataIndex: "details",
      render: (text, record) => {
        if (idToEdit === record.id) {
          return (
            <Form.Item name="details" style={{ marginBottom: 0 }}>
              <Input />
            </Form.Item>
          );
        } else {
          return <>{text}</>;
        }
      }
    },
    {
      title: "Custo",
      dataIndex: "unitPrice",
      render: (text, record) => {
        if (idToEdit === record.id) {
          return (
            <Form.Item
              name="unitPrice"
              rules={[
                {
                  required: true,
                  message: "Insira o custo do item"
                }
              ]}
              style={{ marginBottom: 0 }}
            >
              <Input />
            </Form.Item>
          );
        } else {
          return <>R$ {new Intl.NumberFormat("pt-BR").format(text)}</>;
        }
      }
    },
    {
      title: "Taxa",
      dataIndex: "tax",
      render: (text, record) => {
        if (idToEdit === record.id) {
          return (
            <Form.Item
              name="tax"
              rules={[
                {
                  required: true,
                  message: "Insira a taxa praticada"
                }
              ]}
              style={{ marginBottom: 0 }}
            >
              <Input />
            </Form.Item>
          );
        } else {
          return <>{text}</>;
        }
      }
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (text, record) => {
        if (idToEdit === record.id) {
          return (
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
              <Select>
                <Select.Option value="Em trânsito">Em trânsito</Select.Option>
                <Select.Option value="Em estoque">Em estoque</Select.Option>
                <Select.Option value="Reparo">
                  Assistência Técnica
                </Select.Option>
              </Select>
            </Form.Item>
          );
        } else {
          return <>{text}</>;
        }
      }
    },
    {
      title: "Ações",
      render: (value, record) => {
        return (
          <>
            {isEditMode ? (
              <Tooltip title="Editar produto">
                <EditOutlined
                  style={{ fontSize: 20, marginRight: 8 }}
                  onClick={() => {
                    setIsEditMode(false);
                    setIdToEdit(record.id);
                    handleSetFormFields(record);
                  }}
                />
              </Tooltip>
            ) : (
              <Tooltip title="Salvar edições">
                <Button
                  type="link"
                  htmlType="submit"
                  icon={
                    <CheckSquareOutlined
                      style={{ fontSize: 20, color: "green" }}
                    />
                  }
                />
              </Tooltip>
            )}
            <Divider type="vertical" />
            {isEditMode ? (
              <Tooltip title="Excluir produto">
                <DeleteOutlined
                  style={{ fontSize: 20, color: "red", marginLeft: 8 }}
                  onClick={() =>
                    deleteItem(value.id).then((result) => {
                      message.success(result.message);
                    })
                  }
                />
              </Tooltip>
            ) : (
              <Tooltip title="Cancelar edição">
                <CloseSquareOutlined
                  style={{ fontSize: 20, marginLeft: 8 }}
                  onClick={() => {
                    setIdToEdit(null);
                    setIsEditMode(true);
                  }}
                />
              </Tooltip>
            )}
          </>
        );
      }
    }
  ];

  const handleEditItem = (values) => {
    const updatedItem = [...stock];
    updatedItem.splice(idToEdit, 1, values);

    console.log("updated item --> ", idToEdit, values);
  };

  const handleSetFormFields = (record) => {
    form.setFieldsValue({
      id: record.id,
      imei: record.imei,
      model: record.model,
      color: record.color,
      capacity: record.capacity,
      battery: record.battery,
      details: record.details,
      unitPrice: record.unitPrice,
      tax: record.tax,
      status: record.status
    });
  };

  useEffect(() => {
    getItems().then((result) => {
      // TODO: Refac this error method
      if (result instanceof AxiosError) {
        console.log("result ---> ", result.message);
      } else {
        setStock(result);
      }
    });
  }, []);

  return (
    <>
      <Space direction="horizontal" size="large" style={{ width: "100%" }}>
        <h1>Estoque</h1>
        <Button
          type="primary"
          size="large"
          onClick={handleViewAddNew}
          icon={<PlusOutlined />}
        >
          Adicionar produto
        </Button>
      </Space>
      {viewAddNewItem && (
        <>
          <Divider />
          <Space size="large">
            <Card>
              <h2>Adicionar produto</h2>
              <br />
              <AddItemForm handleGetStock={handleSearch} />
            </Card>
          </Space>
        </>
      )}
      <Divider />
      <Space direction="vertical" size={"large"} style={{ width: "100%" }}>
        <h3>Buscar produto por característica:</h3>
        <Search
          placeholder="Digite sua busca"
          size="large"
          onSearch={handleSearch}
          addonBefore={selectOptions}
          enterButton="Buscar"
          allowClear
          onClear={handleSearch}
        />
        <Alert
          message="Digite uma busca válida"
          type="warning"
          showIcon
          closable
        ></Alert>
      </Space>
      <Divider />
      {searchMode && (
        <Space style={{ marginBottom: 24 }}>
          <h2>
            Mostrando {stock.length} resultado{stock.length > 1 ? "s" : ""} da
            busca por:{" "}
            <strong>&quot;{translateSearchFor(searchFor)}&quot;</strong> e{" "}
            <strong>&quot;{searchTerm}&quot;</strong>
          </h2>
          <Divider type="vertical" />
          <Link onClick={handleSearch}>Limpar resultados</Link>
        </Space>
      )}
      <br />
      <Form form={form} onFinish={handleEditItem}>
        <Table
          dataSource={stock}
          columns={columns}
          rowKey={(record) => record.id}
          showSorterTooltip={{
            target: "sorter-icon"
          }}
          size="middle"
          pagination={false}
          bordered
        />
      </Form>
    </>
  );
}

export default Stock;
