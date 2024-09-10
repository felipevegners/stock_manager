/* eslint-disable no-unused-vars */
import {
  Space,
  Button,
  Divider,
  Card,
  Table,
  Typography,
  Spin,
  message,
  Popover,
  Select,
  Popconfirm
} from "antd";
import {
  PlusOutlined,
  LoadingOutlined,
  CheckSquareOutlined,
  QuestionCircleOutlined
} from "@ant-design/icons";
import { useState, useEffect } from "react";
import AddNewOrderForm from "../../components/AddNewOrderForm";
import { getCustomers } from "../../controllers/CustomerController";
import { getItems, updateItem } from "../../controllers/ItemController";
import {
  cancelOrder,
  createOrder,
  getOrders,
  updateOrder,
  deleteOrder
} from "../../controllers/OrderController";
import { currencyHelper } from "../../helpers/CurrencyHelper";
import { dateFormat } from "../../helpers/DateHelper";
import { OrderContext } from "./OrderContext";
import ViewOrderModal from "../../components/ViewOrderModal";
import OrderPreview from "../../components/OrderPreview";

function Orders() {
  const [isLoading, setIsLoading] = useState(true);
  const [showAddNewOrderForm, setAddNewOrderForm] = useState(false);
  const [customersList, setCustomersList] = useState([]);
  const [itemsAvailable, setItemsAvailable] = useState([]);
  const [orders, setOrders] = useState([]);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewOrderModalContent, setViewOrderModalContent] = useState(null);
  const [newOrderNum, setNewOrderNum] = useState("");
  // For auth implementation:
  const [showOrderDelete, setShowOrderDelete] = useState(true);
  const [editPopOverOpen, setEditPopOverOpen] = useState(false);
  const [confirmEditOrder, setConfirmEditOrder] = useState(false);
  const [editOrderAction, setEditOrderAction] = useState({
    action: "",
    id: "",
    items: []
  });
  const [selectedItems, setSelectedItems] = useState([]);

  const columns = [
    {
      title: "Pedido #",
      dataIndex: "orderNum"
    },
    {
      title: "Cliente",
      dataIndex: "customer",
      render: (text) => text[0]?.name
    },
    {
      title: "Items",
      dataIndex: "items",
      render: (record) => record.length
    },
    {
      title: "Valor do Pedido",
      dataIndex: "orderValue",
      render: (text) => currencyHelper(text)
    },
    {
      title: "Data do Pedido",
      dataIndex: "orderDate",
      render: (text) => dateFormat(text)
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (text) => {
        return (
          <span
            style={{
              color:
                text === "Cancelado"
                  ? "red"
                  : text === "Faturado"
                  ? "black"
                  : "green"
            }}
          >
            {text}
          </span>
        );
      }
    },
    {
      title: "Ações",
      render: (record) => {
        return (
          <>
            {record.status === "Faturado" || record.status === "Cancelado" ? (
              <Space split={<Divider type="vertical" />}>
                <Typography.Link
                  onClick={() => handleViewOrderModal(record.id)}
                >
                  Visualizar
                </Typography.Link>
                {showOrderDelete && (
                  <Popconfirm
                    title="Confirma exclusão?"
                    onConfirm={() => removeOrder(record)}
                  >
                    <Typography.Link>Exluir</Typography.Link>
                  </Popconfirm>
                )}
              </Space>
            ) : record.status === "Em aberto" ? (
              <Space split={<Divider type="vertical" />}>
                <Typography.Link
                  onClick={() => handleViewOrderModal(record.id)}
                >
                  Visualizar
                </Typography.Link>
                <Popover
                  content={editOrderContent}
                  title="Editar pedido"
                  trigger="click"
                  open={editPopOverOpen}
                >
                  <Typography.Link onClick={() => showEditPopOver(record)}>
                    Editar
                  </Typography.Link>
                </Popover>
                {showOrderDelete && (
                  <Popconfirm
                    title="Excluir pedido"
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
                    onConfirm={() => removeOrder(record)}
                    okButtonProps={{
                      danger: true
                    }}
                  >
                    <Typography.Link style={{ color: "red" }}>
                      Exluir
                    </Typography.Link>
                  </Popconfirm>
                )}
              </Space>
            ) : (
              <></>
            )}
          </>
        );
      }
    }
  ];

  const fetchData = async () => {
    await getCustomers().then((result) => {
      // TODO: Refac this error method
      if (result?.response?.status === 400) {
        message.error("Erro ao carregar dados dos clientes. Atualize a página");
      } else {
        setCustomersList(result);
        setTimeout(() => {
          setIsLoading(false);
        }, 1000);
      }
    });
    await getItems().then((result) => {
      const availableItems = result.filter((item) => item.isAvailable);
      const sanitizedItems = availableItems.map((v, index) => ({
        ...v,
        key: index,
        sellPrice: 0
      }));
      setItemsAvailable(sanitizedItems);
    });

    await getOrders().then((result) => {
      setOrders(result);
    });
  };

  const createNewOrder = async (newOrderData) => {
    await createOrder(newOrderData).then((result) => {
      if (result?.response?.status === 400)
        message.error("Pedido não criado. Verifique os dados inseridos.");
      else {
        message.success(result.message);
      }
    });
  };

  const handleUpDateOrder = async (orderId, updatedOrderData) => {
    await updateOrder(orderId, updatedOrderData).then((result) => {
      if (result?.response?.status === 400)
        message.error("Pedido não atualizado. Verifique os dados inseridos.");
      else {
        message.success(result.message);
        setTimeout(() => {
          fetchData();
        }, 1000);
      }
    });
  };

  const handleCancelOrder = async () => {
    await cancelOrder(editOrderAction.id).then((result) => {
      if (result?.response?.status === 400)
        message.error("Pedido não cancelado. Verifique os dados inseridos.");
      else {
        message.success(result.message);
        setTimeout(() => {
          fetchData();
        }, 1000);
      }
    });
  };

  const removeOrder = async (order) => {
    await deleteOrder(order.id).then((result) => {
      if (result?.response?.status === 400)
        message.error("Pedido não excluido. Tente novamente.");
      else {
        handleItemsAvailability(order.items, "deleted");
        message.success(result.message);
        setTimeout(() => {
          fetchData();
        }, 1000);
      }
    });
  };

  const handleViewOrderModal = async (orderId) => {
    await getOrders({ id: orderId }).then((result) => {
      if (result?.response?.status === 400)
        message.error("Pedido não encontrado. Tente novamente.");
      else {
        setViewOrderModalContent(result);
        setIsViewModalOpen(true);
      }
    });
  };

  const handleItemsAvailability = (orderItems, action) => {
    for (let item in orderItems) {
      if (action === "new order") {
        updateItem(orderItems[item].id, {
          isAvailable: false,
          status: "Pendente"
        });
      } else if (action === "cancelled") {
        updateItem(orderItems[item].id, {
          isAvailable: true,
          status: "Em estoque"
        });
      } else if (action === "deleted") {
        updateItem(orderItems[item].id, {
          isAvailable: true,
          status: "Em estoque"
        });
      } else {
        updateItem(orderItems[item].id, {
          isAvailable: false,
          status: "Vendido"
        });
      }
    }
  };

  const generateOrderNum = () => {
    setAddNewOrderForm(true);
    let count = orders.length + 1;
    const orderNum = "0000".substr(String(count).length) + count;
    setNewOrderNum(orderNum);
  };

  const handleEditOrderAction = (value) => {
    editOrderAction.action = value;
    setConfirmEditOrder(true);
  };

  const showEditPopOver = (orderData) => {
    setEditPopOverOpen(true);
    editOrderAction.id = orderData.id;
    editOrderAction.items = orderData.items;
  };

  const handleEditOrder = async () => {
    if (editOrderAction.action === "payd") {
      const updatedOrderData = {
        status: "Faturado"
      };
      await handleUpDateOrder(editOrderAction.id, updatedOrderData);
      handleItemsAvailability(editOrderAction.items, "payd");
    } else {
      await handleCancelOrder(editOrderAction.id);
      handleItemsAvailability(editOrderAction.items, "cancelled");
    }
    setEditPopOverOpen(false);
  };

  const editOrderContent = (
    <Space direction="vertical" style={{ width: "100%" }}>
      <Select
        name="editOrder"
        style={{ width: "100%" }}
        placeholder="Selecione"
        onSelect={(value) => handleEditOrderAction(value)}
        options={[
          { value: "payd", label: "Faturado" },
          { value: "cancelled", label: "Cancelado" }
        ]}
      />
      <Space>
        <Button
          type="primary"
          icon={<CheckSquareOutlined />}
          onClick={handleEditOrder}
          disabled={!confirmEditOrder}
        >
          Confirmar
        </Button>
        <Typography.Link onClick={() => setEditPopOverOpen(false)}>
          Fechar
        </Typography.Link>
      </Space>
    </Space>
  );

  useEffect(() => {
    fetchData();
  }, [newOrderNum]);

  return (
    <>
      <OrderContext.Provider
        value={{
          customersList,
          itemsAvailable,
          setItemsAvailable,
          viewOrderModalContent,
          newOrderNum,
          isViewModalOpen,
          selectedItems,
          setSelectedItems,
          setAddNewOrderForm,
          createNewOrder,
          handleUpDateOrder,
          handleCancelOrder,
          setIsViewModalOpen,
          handleItemsAvailability,
          fetchData
        }}
      >
        <Space direction="horizontal" size="large" style={{ width: "100%" }}>
          <h1>Gerenciar Pedidos</h1>
          <Button
            type="primary"
            size="large"
            onClick={generateOrderNum}
            icon={<PlusOutlined />}
          >
            Novo pedido
          </Button>
        </Space>
        {showAddNewOrderForm && (
          <>
            <Divider />
            <Space
              size="large"
              direction="vertical"
              style={{ display: "flex", transition: "all 0.6s ease-in" }}
            >
              <AddNewOrderForm>
                <OrderPreview />
              </AddNewOrderForm>
            </Space>
          </>
        )}
        {!showAddNewOrderForm && (
          <>
            <Divider />
            <Space
              size="large"
              direction="vertical"
              style={{ display: "flex", transition: "all 0.6s ease-in" }}
            >
              <Card>
                <h1>Todos os Pedidos</h1>
                <Divider />
                {isLoading ? (
                  <Spin
                    spinning={isLoading}
                    indicator={<LoadingOutlined spin />}
                    size="large"
                  />
                ) : (
                  <Table
                    rowKey={(record) => record.id}
                    dataSource={orders}
                    columns={columns}
                    bordered
                  />
                )}
                <ViewOrderModal />
              </Card>
            </Space>
          </>
        )}
      </OrderContext.Provider>
    </>
  );
}

export default Orders;
