import { useEffect, useState } from "react";
import { Card, Space, Flex, message, Divider, List } from "antd";
import { FileDoneOutlined, ProductOutlined } from "@ant-design/icons";
import { getItems } from "../../controllers/ItemController";
import { getOrders } from "../../controllers/OrderController";
import { currencyHelper } from "../../helpers/CurrencyHelper";
import "./styles.css";
import { dateFormat } from "../../helpers/DateHelper";

function Dashboard() {
  // const [isLoading, setIsloading] = useState(false);
  const [stock, setStock] = useState([]);
  const [stockTotal, setStockTotal] = useState({
    totalValue: 0,
    totalCosts: 0
  });
  const [orders, setOrders] = useState([]);
  const [ordersTotal, setOrdersTotal] = useState({
    openOrders: 0,
    canceledOrders: 0,
    finishedOrders: 0,
    totalValue: 0
  });

  const fetchData = async () => {
    await getItems().then((result) => {
      if (result.status === 400) {
        message.error("Erro ao carregar os dados, atualize a página.");
      } else {
        setStock(result);
      }
    });
    await getOrders().then((result) => {
      if (result.status === 400) {
        message.error("Erro ao carregar os dados, atualize a página.");
      } else {
        setOrders(result);
      }
    });
  };

  const calculateStock = () => {
    const totalPrice = stock?.reduce((acc, obj) => {
      return acc + obj.itemCosts;
    }, 0);
    const totalItemsCosts = stock?.reduce((acc, obj) => {
      return acc + obj.totalCosts;
    }, 0);
    setStockTotal({ totalValue: totalPrice, totalCosts: totalItemsCosts });
  };

  const calculateOrders = () => {
    const active = orders.filter((order) => order.status === "Em aberto");
    const finished = orders.filter((order) => order.status === "Faturado");
    const cancelled = orders.filter((order) => order.status === "Cancelado");

    const total = orders?.reduce((acc, obj) => {
      return acc + obj.orderValue;
    }, 0);
    setOrdersTotal({
      openOrders: active.length,
      canceledOrders: cancelled.length,
      finishedOrders: finished.length,
      totalValue: total
    });
    // setOrders({ ...orders, openOrders: activeOrders.length });
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (Object.keys(stock)) {
      calculateStock();
    }
    if (Object.keys(orders)) {
      calculateOrders();
    }
  }, [stock, orders]);

  return (
    <>
      <h1>Dashboard</h1>
      <Divider />
      <Flex gap="middle">
        <Card
          title={
            <>
              <FileDoneOutlined /> Pedidos
            </>
          }
          className="dash-card"
        >
          <Flex gap="middle">
            <Flex vertical className="dash-blocks">
              <small>Total de pedidos</small>
              <h1>{orders.length}</h1>
            </Flex>
            <Flex vertical className="dash-blocks">
              <small>Pedidos faturados</small>
              <h1>{ordersTotal.finishedOrders}</h1>
            </Flex>
            <Flex vertical className="dash-blocks">
              <small>Pedidos em aberto</small>
              <h1>{ordersTotal.openOrders}</h1>
            </Flex>
            <Flex vertical className="dash-blocks">
              <small>Pedidos cancelados</small>
              <h1>{ordersTotal.canceledOrders}</h1>
            </Flex>
          </Flex>
          <Divider />
          <Flex vertical>
            <small>Total em pedidos</small>
            <h1 style={{ color: "green" }}>
              {currencyHelper(ordersTotal.totalValue)}
            </h1>
          </Flex>
          <Divider />
          <Flex vertical>
            <small>Últimos 3 pedidos</small>
            <List>
              <List.Item>
                <p>Numero</p>
                <p>Data</p>
                <p>Cliente</p>
                <p>Qtd</p>
                <p>Valor</p>
                <p>Status</p>
              </List.Item>
              {orders &&
                orders.slice(0, 3).map((order) => (
                  <List.Item key={order.id}>
                    <p>#{order.orderNum}</p>
                    <p>{dateFormat(order.orderDate)}</p>
                    <p>{order.customer[0].name}</p>
                    <p>{order.items.length}</p>
                    <p>{currencyHelper(order.orderValue)}</p>
                    <p>{order.status}</p>
                  </List.Item>
                ))}
            </List>
          </Flex>
          <Flex></Flex>
        </Card>
        <Card
          title={
            <>
              <ProductOutlined /> Estoque
            </>
          }
          className="dash-card"
        >
          <small>Total de itens em estoque</small>
          <h1>{stock.length}</h1>
          <small>Valor total em Estoque</small>
          <h1 style={{ color: "green" }}>
            {currencyHelper(stockTotal.totalCosts)}
          </h1>
          <small>Custo total do Estoque</small>
          <h1 style={{ color: "SteelBlue" }}>
            {currencyHelper(stockTotal.totalValue, "en-US", "USD")}
          </h1>
        </Card>
      </Flex>
    </>
  );
}

export default Dashboard;
