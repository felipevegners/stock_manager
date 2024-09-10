/* eslint-disable react/prop-types */
import { Card, Col, Divider, Row, Space, Table, Typography } from "antd";
import { currencyHelper } from "../helpers/CurrencyHelper";

function OrderPreview({
  newOrderNum,
  selectedCustomer,
  deliveryMethod,
  pickupBy,
  freigtPrice,
  orderObservations,
  paymentMethod
}) {
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

  return (
    <Card style={{ backgroundColor: "#fff" }}>
      <Row>
        <h2>Resumo do Pedido</h2>
        <Divider />
        <Col span={11}>
          <Space size="small" direction="vertical">
            <h1>
              Pedido <strong>#{newOrderNum}</strong>
            </h1>
            <h3>
              <strong>Cliente</strong>:{" "}
              {selectedCustomer &&
                selectedCustomer.map((customer) => (
                  <span key={customer.id}>
                    {customer.name} - {customer.phone} - {customer.email}
                  </span>
                ))}{" "}
            </h3>
          </Space>
        </Col>
        <Col span={2}>
          <Divider type="vertical" />
        </Col>
        <Col span={11}>
          {deliveryMethod === "Retirada" ? (
            <>
              <h2>{deliveryMethod}</h2>
              <h3>Quem retira: {pickupBy}</h3>
            </>
          ) : (
            <>
              <h2>{deliveryMethod}</h2>
              <h3>
                <strong>Endereço:</strong>{" "}
                {selectedCustomer &&
                  selectedCustomer.map((customer) => (
                    <span key={customer.id}>
                      {customer.street}, {customer.stNumber} - {customer.city} -{" "}
                      {customer.state}
                    </span>
                  ))}{" "}
              </h3>
            </>
          )}
        </Col>
      </Row>
      <Row>
        <Divider />
        <Col span={24}>
          <Table bordered dataSource={[]} columns={[]} />
          <Divider />
        </Col>
      </Row>
      <Row>
        <Col span={8}>
          <h2>
            Total de items: <strong>{"selectedItems.length"}</strong>
          </h2>
          <h2>
            Valor total dos itens:{" "}
            <strong>{"currencyHelper(totalItemsPrice)"}</strong>
          </h2>
        </Col>
        <Col span={8}>
          <h3>
            Valor do frete: <strong>{currencyHelper(freigtPrice)}</strong>
          </h3>
          <h4>
            <strong>Observações: </strong>
            {orderObservations}
          </h4>
        </Col>
        <Col span={8} style={{ backgroundColor: "#ccc", padding: 12 }}>
          <h2>
            Valor total: <strong>{"currencyHelper(totalOrderPrice)"}</strong>
          </h2>
          <h3>
            Forma de Pgto:{" "}
            <strong>
              {paymentMethod?.method}
              {paymentMethod?.conditions && <> - {paymentMethod.conditions}</>}
            </strong>
          </h3>
        </Col>
      </Row>
    </Card>
  );
}

export default OrderPreview;
