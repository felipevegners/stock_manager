import { useContext } from "react";
import { OrderContext } from "../pages/Orders/OrderContext";

import { Modal, Row, Col, Divider, Space, Table, Button } from "antd";
import { currencyHelper } from "../helpers/CurrencyHelper";
import { CloseOutlined, PrinterOutlined } from "@ant-design/icons";

function ViewOrderModal() {
  const { isViewModalOpen, setIsViewModalOpen, viewOrderModalContent } =
    useContext(OrderContext);

  const finalColumns = [
    {
      title: "Produto",
      dataIndex: ["imei", "model", "color", "capacity", "battery"],
      render: (_, record) => {
        return (
          <p>
            {record.imei} - {record.model} - {record.color} - {record.capacity}
            GB - Bateria {record.battery}%
          </p>
        );
      }
    },
    {
      title: "Detalhes",
      dataIndex: "details"
    },
    {
      title: "Valor",
      dataIndex: "tax",
      render: (text, record) => {
        return (
          <>
            {new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL"
            }).format(record.unitPrice + record.profit)}
          </>
        );
      }
    }
  ];

  return (
    <Modal
      open={isViewModalOpen}
      onCancel={() => setIsViewModalOpen(false)}
      width={"85%"}
      footer={
        <Space>
          <Button icon={<PrinterOutlined />}>Imprimir</Button>
          <Button
            type="primary"
            icon={<CloseOutlined />}
            onClick={() => setIsViewModalOpen(false)}
          >
            Fechar
          </Button>
        </Space>
      }
    >
      {viewOrderModalContent ? (
        <>
          <Row>
            <h2>Resumo do Pedido</h2>
            <Divider />
            <Col span={11}>
              <Space size="small" direction="vertical">
                <h1>
                  Pedido <strong>#{viewOrderModalContent[0].orderNum}</strong>
                </h1>
                <h3>
                  <strong>Cliente</strong>:{" "}
                  {viewOrderModalContent[0].customer &&
                    viewOrderModalContent[0].customer.map((customer) => (
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
              {viewOrderModalContent[0].shipping.method === "Retirada" ? (
                <>
                  <h2>{viewOrderModalContent[0].shipping.method}</h2>
                  <h3>
                    Quem retira: {viewOrderModalContent[0].shipping.details}
                  </h3>
                </>
              ) : (
                <>
                  <h2>{viewOrderModalContent[0].shipping.method}</h2>
                  <h3>
                    <strong>Endereço:</strong>{" "}
                    {viewOrderModalContent[0].customer &&
                      viewOrderModalContent[0].customer.map((customer) => (
                        <span key={customer.id}>
                          {customer.street}, {customer.stNumber} -{" "}
                          {customer.city} - {customer.state}
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
              <Table
                columns={finalColumns}
                dataSource={viewOrderModalContent[0].items}
                rowKey={viewOrderModalContent[0].id}
                pagination={false}
              />
              <Divider />
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <h2>
                Total de items:{" "}
                <strong>{viewOrderModalContent[0].items.length}</strong>
              </h2>
              {/* <h2>
            Valor total dos itens:{" "}
            <strong>{currencyHelper(totalItemsPrice)}</strong>
          </h2> */}
            </Col>
            <Col span={8}>
              <h3>
                Valor do frete:{" "}
                <strong>
                  {currencyHelper(viewOrderModalContent[0].shipping.costs)}
                </strong>
              </h3>
            </Col>
            <Col span={8} style={{ backgroundColor: "#ddd", padding: 12 }}>
              <h2>
                Valor total:{" "}
                <strong>
                  {currencyHelper(viewOrderModalContent[0].orderValue)}
                </strong>
              </h2>
              <h3>
                Forma de Pgto:{" "}
                <strong>
                  {viewOrderModalContent[0].payment.method}
                  {viewOrderModalContent[0].payment.conditions && (
                    <> - {viewOrderModalContent[0].payment.conditions}</>
                  )}
                </strong>
              </h3>
            </Col>
            <Divider />
          </Row>
        </>
      ) : (
        <></>
      )}
    </Modal>
  );
}

export default ViewOrderModal;