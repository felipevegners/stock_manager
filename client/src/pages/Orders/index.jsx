import { Space, Button, Divider, Card, Table, Typography } from "antd";
import { PlusOutlined, CloseOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import AddNewOrderForm from "../../components/AddNewOrderForm";
import { getCustomers } from "../../controllers/CustomerController";
import { OrderContext } from "./OrderContext";
import { getItems } from "../../controllers/ItemController";

function Orders() {
  // const [isLoading, setIsLoading] = useState(false);
  const [showAddNewOrderForm, setAddNewOrderForm] = useState(false);
  const [customersList, setCustomersList] = useState([]);
  const [itemsAvailable, setItemsAvailable] = useState([]);
  // const [orders, setOrders] = useState([]);

  const orderData = [
    {
      orderNumber: "0001",
      orderDate: "17-08-2024",
      orderCustomer: "Vegners",
      orderItems: "12",
      orderValue: "R$ 5.869,80",
      orderStatus: "Em aberto"
    }
  ];

  const columns = [
    {
      title: "Pedido #",
      dataIndex: "orderNumber"
    },
    {
      title: "Cliente",
      dataIndex: "orderCustomer"
    },
    {
      title: "Items",
      dataIndex: "orderItems"
    },
    {
      title: "Valor do Pedido",
      dataIndex: "orderValue"
    },
    {
      title: "Data do Pedido",
      dataIndex: "orderDate"
    },
    {
      title: "Status",
      dataIndex: "orderStatus"
    },
    {
      title: "Ações",
      render: () => {
        return (
          <>
            <Space split={<Divider type="vertical" />}>
              <Typography.Link>Ver</Typography.Link>
              <Typography.Link>Editar</Typography.Link>
              <Typography.Link>Imprimir</Typography.Link>
            </Space>
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
          // setIsLoading(false);
        }, 1000);
      }
    });
    await getItems().then((result) => {
      const availableItems = result.filter((item) => item.isAvailable);
      setItemsAvailable(availableItems);
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <OrderContext.Provider value={{ customersList, itemsAvailable }}>
        <Space direction="horizontal" size="large" style={{ width: "100%" }}>
          <h1>Pedidos</h1>
          <Button
            type="primary"
            size="large"
            onClick={() => setAddNewOrderForm(true)}
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
              <Card
                title="Gerar novo pedido de venda ou orçamento"
                extra={
                  <CloseOutlined onClick={() => setAddNewOrderForm(false)} />
                }
              >
                <AddNewOrderForm />
              </Card>
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
            <h1>Pedidos </h1>
            <Table
              rowKey={(record) => record.orderNumber}
              dataSource={orderData}
              columns={columns}
              bordered
            />
          </Card>
        </Space>
      </OrderContext.Provider>
    </>
  );
}

export default Orders;
