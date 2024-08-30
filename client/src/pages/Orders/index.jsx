import {
  Space,
  Button,
  Divider,
  Card,
  Table,
  Typography,
  Spin,
  message
} from "antd";
import { PlusOutlined, LoadingOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import AddNewOrderForm from "../../components/AddNewOrderForm";
import { getCustomers } from "../../controllers/CustomerController";
import { getItems, updateItem } from "../../controllers/ItemController";
import {
  cancelOrder,
  createOrder,
  getOrders,
  updateOrder
} from "../../controllers/OrderController";
import { currencyHelper } from "../../helpers/CurrencyHelper";
import { dateFormat } from "../../helpers/DateHelper";
import { OrderContext } from "./OrderContext";
import ViewOrderModal from "../../components/ViewOrderModal";

function Orders() {
  const [isLoading, setIsLoading] = useState(true);
  const [showAddNewOrderForm, setAddNewOrderForm] = useState(false);
  const [customersList, setCustomersList] = useState([]);
  const [itemsAvailable, setItemsAvailable] = useState([]);
  const [orders, setOrders] = useState([]);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewOrderModalContent, setViewOrderModalContent] = useState(null);
  const [newOrderNum, setNewOrderNum] = useState("");

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
            {record.status === "Faturado" ? (
              <Space split={<Divider type="vertical" />}>
                <Typography.Link
                  onClick={() => handleViewOrderModal(record.id)}
                >
                  Visualizar
                </Typography.Link>
              </Space>
            ) : record.status === "Em aberto" ? (
              <Space split={<Divider type="vertical" />}>
                <Typography.Link
                  onClick={() => handleViewOrderModal(record.id)}
                >
                  Visualizar
                </Typography.Link>
                <Typography.Link>Editar</Typography.Link>
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
      if (result.error) {
        console.log("result ---> ", result.message);
      } else {
        setCustomersList(result);
        setTimeout(() => {
          setIsLoading(false);
        }, 1000);
      }
    });
    await getItems().then((result) => {
      const availableItems = result.filter((item) => item.isAvailable);
      setItemsAvailable(availableItems);
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

  const upDateOrder = async (updatedOrderData) => {
    await updateOrder(updatedOrderData).then((result) => {
      if (result?.response?.status === 400)
        message.error("Pedido não atualizado. Verifique os dados inseridos.");
      else {
        message.success(result.message);
      }
    });
  };

  const cancelAnOrder = async (orderId) => {
    await cancelOrder(orderId).then((result) => {
      if (result?.response?.status === 400)
        message.error("Pedido não cancelado. Verifique os dados inseridos.");
      else {
        message.success(result.message);
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

  const turnItemsUnavailable = (orderItems) => {
    console.log("orderItems -> ", orderItems);
    for (let item in orderItems) {
      updateItem(orderItems[item].id, {
        isAvailable: false,
        status: "Pendente"
      });
    }
  };

  const generateOrderNum = () => {
    setAddNewOrderForm(true);
    let count = orders.length + 1;
    const orderNum = "0000".substr(String(count).length) + count;
    setNewOrderNum(orderNum);
  };

  useEffect(() => {
    fetchData();
    console.log("OrderNum -> ", newOrderNum);
  }, [newOrderNum]);

  return (
    <>
      <OrderContext.Provider
        value={{
          customersList,
          itemsAvailable,
          setAddNewOrderForm,
          createNewOrder,
          newOrderNum,
          upDateOrder,
          cancelAnOrder,
          isViewModalOpen,
          setIsViewModalOpen,
          viewOrderModalContent,
          turnItemsUnavailable,
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
              <AddNewOrderForm />
            </Space>
          </>
        )}
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
      </OrderContext.Provider>
    </>
  );
}

export default Orders;
