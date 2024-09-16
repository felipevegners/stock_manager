/* eslint-disable react/prop-types */
import { useContext, useEffect, useRef, useState } from "react";
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
  Badge,
  Space,
  Button
} from "antd";
import { QuestionCircleOutlined, SearchOutlined } from "@ant-design/icons";
import { deleteItem, updateItem } from "../controllers/ItemController";
import { currencyHelper } from "../helpers/CurrencyHelper";
import Highlighter from "react-highlight-words";
import { ItemContext } from "../pages/Stock/ItemContext";

const ItemsTable = () => {
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
      ) : inputType === "select" && dataIndex === "model" ? (
        <Select>
          {modelsCat.map((model, index) => (
            <Select.Option key={index} value={model}>
              {model}
            </Select.Option>
          ))}
        </Select>
      ) : inputType === "select" && dataIndex === "color" ? (
        <Select>
          {colorsCat.map((color, index) => (
            <Select.Option key={index} value={color}>
              {color}
            </Select.Option>
          ))}
        </Select>
      ) : inputType === "select" && dataIndex === "capacity" ? (
        <Select>
          {capacityCat.map((capacity, index) => (
            <Select.Option key={index} value={capacity}>
              {capacity}
            </Select.Option>
          ))}
        </Select>
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

  const { stock, fetchData, modelsCat, colorsCat, capacityCat } =
    useContext(ItemContext);
  const [form] = Form.useForm();
  const [data, setData] = useState(stock);
  const [editingKey, setEditingKey] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };

  const getColumnSearchProps = (dataIndex, name) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close
    }) => (
      <div
        style={{
          padding: 8
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Buscar por ${name}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: "block"
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90
            }}
          >
            Buscar
          </Button>
          <Button
            onClick={() => {
              clearFilters;
              handleReset(clearFilters);
            }}
            size="small"
            style={{
              width: 90
            }}
          >
            Limpar
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({
                closeDropdown: false
              });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filtrar
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
              handleSearch(selectedKeys, confirm, dataIndex);
            }}
          >
            Fechar
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? "#1677ff" : undefined
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: "#ffc069",
            padding: 0
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      )
  });

  const isEditing = (record) => record.id === editingKey;

  const edit = (record) => {
    form.setFieldsValue({
      imei: record.imei,
      model: record.model,
      color: record.color,
      capacity: record.capacity,
      battery: record.battery,
      details: record.details,
      itemCosts: record.itemCosts,
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
      sorter: (a, b) => a.batch.name.length - b.batch.name.length,
      render: (text) => {
        return <>{text?.name}</>;
      }
    },
    {
      title: "IMEI",
      dataIndex: "imei",
      editable: true,
      width: "10%",
      ...getColumnSearchProps("imei", "IMEI")
    },
    {
      title: "Modelo",
      dataIndex: "model",
      editable: true,
      with: "8%",
      ...getColumnSearchProps("model", "Modelo")
    },
    {
      title: "Cor",
      dataIndex: "color",
      editable: true,
      width: "8%",
      ...getColumnSearchProps("color", "Cor")
    },
    {
      title: "Capacidade",
      dataIndex: "capacity",
      editable: true,
      width: "5%",
      filters: [
        {
          text: "64 GB",
          value: "64GB"
        },
        {
          text: "128 GB",
          value: "128GB"
        },
        {
          text: "256 GB",
          value: "256GB"
        },
        {
          text: "512 GB",
          value: "512GB"
        }
      ],
      onFilter: (value, record) => record.capacity.startsWith(value),
      filterSearch: true
    },
    {
      title: "Bateria",
      dataIndex: "battery",
      editable: true,
      width: "5%",
      render: (text) => {
        return <>{text}%</>;
      }
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
      editable: true,
      sorter: (a, b) => a.itemCosts - b.itemCosts,
      render: (text) => {
        return <>{currencyHelper(text, "en-US", "USD")}</>;
      }
    },
    {
      title: "Custo Total",
      dataIndex: "totalCosts",
      editable: false,
      sorter: (a, b) => a.totalCosts - b.totalCosts,
      render: (text) => {
        return <>{currencyHelper(text)}</>;
      }
    },
    {
      title: "Status",
      dataIndex: "status",
      editable: true,
      width: "8%",
      sorter: (a, b) => a.status.length - b.status.length,
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
    setData(stock);
  }, [stock]);

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType:
          col.dataIndex === "itemCosts"
            ? "number"
            : col.dataIndex === "status"
            ? "select"
            : col.dataIndex === "model"
            ? "select"
            : col.dataIndex === "color"
            ? "select"
            : col.dataIndex === "capacity"
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
