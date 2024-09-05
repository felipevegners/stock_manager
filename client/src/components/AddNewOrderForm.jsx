/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useContext, useEffect, useRef, useState } from "react";
import {
  Button,
  Form,
  Row,
  Col,
  Card,
  Divider,
  Input,
  Select,
  Table,
  Space,
  Typography,
  message,
  InputNumber
} from "antd";

const { TextArea } = Input;
import { OrderContext } from "../pages/Orders/OrderContext";
import { currencyHelper } from "../helpers/CurrencyHelper";
import { currencyFormatter } from "../helpers/CurrencyFormatter";

import {
  CloseOutlined,
  CheckSquareOutlined,
  PrinterOutlined,
  SaveOutlined
} from "@ant-design/icons";
import OrderItemsTable from "./OrderItemsTable";

const { Option } = Select;

function AddNewOrderForm() {
  const {
    customersList,
    itemsAvailable,
    setAddNewOrderForm,
    newOrderNum,
    createNewOrder,
    handleItemsAvailability,
    fetchData
  } = useContext(OrderContext);

  const [isFuturePayment, setIsFuturePayment] = useState(false);
  const [deliveryPickUp, setDeliveryPickUp] = useState(false);
  const [deliveryMethod, setDeliveryMethod] = useState("");
  const [freigtPrice, setFreightPrice] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState([]);
  const [pickupBy, setPickupBy] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);
  const [stockItems, setStockItems] = useState([]);
  const [totalItemsPrice, setTotalItemsPrice] = useState(null);
  const [totalOrderPrice, setTotalOrderPrice] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState({});
  const [orderStatus, setOrderStatus] = useState(null);
  const [orderObservations, setOrderObservations] = useState("");
  const [pricedItemsData, setPricedItemsData] = useState([]);

  const inputCustomerName = useRef();
  const inputPickupBy = useRef();
  const inputFreightPrice = useRef();
  const inputPaymentConditions = useRef();
  const inputObservations = useRef();

  const [form] = Form.useForm();

  const itemsColumns = [
    {
      title: "Lote",
      dataIndex: "batch",
      render: (record) => {
        return <>{record.name}</>;
      }
    },
    {
      title: "IMEI",
      dataIndex: "imei"
    },
    {
      title: "Modelo",
      dataIndex: "model"
    },
    {
      title: "Cor",
      dataIndex: "color"
    },
    {
      title: "Capacidade",
      dataIndex: "capacity",
      render: (text) => {
        return <>{text} GB</>;
      }
    },
    {
      title: "Bateria",
      dataIndex: "battery",
      render: (text) => {
        return <>{text}%</>;
      }
    },
    {
      title: "Detalhes",
      dataIndex: "details",
      width: "15%"
    },
    {
      title: "Preço Custo",
      dataIndex: "totalCosts",
      width: "8%",
      render: (text) => {
        return currencyHelper(text);
      }
    }
  ];

  const addKey = () => {
    const itemsWithKey = itemsAvailable.map((v, index) => ({
      ...v,
      key: index
    }));

    setStockItems(itemsWithKey);
  };

  const rowSelection = {
    onChange: (_, selectedRows) => {
      const addSellPrice = selectedRows.map((item) => ({
        ...item,
        sellPrice: parseFloat("0.00", 2)
      }));

      setSelectedItems(addSellPrice);
    }
  };
  const hasSelected = selectedItems.length > 0;

  const handleCustomerData = (customer) => {
    const customerData = customersList.filter((data) => data.name === customer);
    setSelectedCustomer(customerData);
  };

  const handlePaymentConditions = (e) => {
    e.preventDefault();
    if (e.target.value !== "")
      setPaymentMethod({ ...paymentMethod, conditions: e.target.value });
    else setPaymentMethod({ ...paymentMethod, conditions: "" });
  };

  const handlePaymentForm = (value) => {
    if (value === "a prazo") {
      setOrderStatus("Em aberto");
      setIsFuturePayment(true);
      setPaymentMethod({ ...paymentMethod, method: "À prazo" });
    } else if (value === "a pagar") {
      setOrderStatus("Em aberto");
      setIsFuturePayment(false);
      setPaymentMethod({ ...paymentMethod, method: "À pagar" });
    } else if (value === "pago") {
      setOrderStatus("Em aberto");
      setIsFuturePayment(false);
      setPaymentMethod({ ...paymentMethod, method: "À Vista" });
    }
  };

  const handleDeliveryMethod = (value) => {
    if (value === "pickup") {
      setDeliveryMethod("Retirada");
      setDeliveryPickUp(true);
      setFreightPrice(0);
    } else if (value === "motoboy") {
      setDeliveryMethod("Entrega Motoboy");
      setDeliveryPickUp(false);
    } else {
      setDeliveryMethod("Entrega - Outro");
      setDeliveryPickUp(false);
      setFreightPrice(0);
    }
  };

  const handleFreightPrice = (value) => {
    if (value) setFreightPrice(value);
    else setFreightPrice(0);
  };

  const handlePickupBy = (e) => {
    setPickupBy(e.target.value);
  };

  const calculateOrderPrice = () => {
    if (pricedItemsData.length > 0) {
      const totalItemsPrice = pricedItemsData?.reduce((acc, obj) => {
        return acc + obj.sellPrice;
      }, 0);

      const totalOrder = totalItemsPrice + freigtPrice;

      setTotalItemsPrice(totalItemsPrice);
      setTotalOrderPrice(totalOrder);
    } else {
      setTotalItemsPrice(0);
      setTotalOrderPrice(0);
    }
  };

  const handleOrderObservations = (e) => {
    setOrderObservations(e.target.value);
  };

  const addNewOrder = (values) => {
    const newOrderData = {
      orderNum: newOrderNum,
      customer: selectedCustomer,
      items: pricedItemsData,
      shipping: {
        method: deliveryMethod,
        costs: freigtPrice,
        details: pickupBy
      },
      orderValue: totalOrderPrice,
      payment: paymentMethod,
      status: orderStatus,
      observations: values.observations ? values.observations : "-",
      isDraft: false
    };

    createNewOrder(newOrderData).then((result) => {
      if (result?.response?.status === 400) {
        message.error("Pedido não criado. Verifique os dados inseridos.");
      } else {
        setTimeout(() => {
          form.resetFields();
          setSelectedItems([]);
          setAddNewOrderForm(false);
          setPricedItemsData([]);
          fetchData();
        }, 1000);
        handleItemsAvailability(newOrderData.items, false);
        message.success(result.message);
      }
    });
  };

  const onFinish = (values) => {
    addNewOrder(values);
  };

  useEffect(() => {
    if (pricedItemsData) {
      calculateOrderPrice();
    }
    addKey();
  }, [
    selectedItems,
    pricedItemsData,
    totalOrderPrice,
    freigtPrice,
    orderStatus
  ]);

  return (
    <>
      <Form form={form} layout="vertical" onFinish={onFinish} size="large">
        <Card
          title={<h3>Dados do cliente:</h3>}
          extra={<CloseOutlined onClick={() => setAddNewOrderForm(false)} />}
          style={{ backgroundColor: "#dcdcdc" }}
        >
          <Row
            gutter={{
              xs: 8,
              sm: 16,
              md: 24,
              lg: 32
            }}
          >
            <Col span={6}>
              <Form.Item
                label="Selecione o Cliente"
                name="customerName"
                rules={[
                  {
                    required: true,
                    message: "Selecione o cliente"
                  }
                ]}
              >
                <Select
                  ref={inputCustomerName}
                  onSelect={(value) => handleCustomerData(value)}
                  placeholder="Selecione o cliente"
                >
                  {customersList &&
                    customersList.map((customer) => (
                      <Option key={customer.id} value={customer.name}>
                        {customer.name}
                      </Option>
                    ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={24}>
              <h2>
                Itens do pedido:{" "}
                {hasSelected
                  ? `${selectedItems.length} produto(s) selecionado(s)`
                  : null}
              </h2>
              <Divider />
              <Table
                columns={itemsColumns}
                dataSource={stockItems}
                rowKey={stockItems.id}
                rowSelection={{
                  type: "checkbox",
                  ...rowSelection
                }}
              />
            </Col>
            <Col span={24}>
              <h2>Frete e Pagamento</h2>
              <Divider />
            </Col>
            <Col span={4}>
              <Form.Item
                label="Forma de Pagamento"
                name="paymentTerm"
                rules={[
                  {
                    required: true,
                    message: "Selecione a forma de pagamento"
                  }
                ]}
              >
                <Select
                  placeholder="Forma de pagamento"
                  onSelect={(value) => handlePaymentForm(value)}
                >
                  <Option value="pago">À vista</Option>
                  <Option value="a pagar">À pagar</Option>
                  <Option value="a prazo">À prazo</Option>
                </Select>
              </Form.Item>
            </Col>
            {isFuturePayment && (
              <Col span={3}>
                <Form.Item
                  label="Condições"
                  name="paymentConditions"
                  rules={[
                    {
                      required: true,
                      message: "Insira a condição de pagamento"
                    }
                  ]}
                >
                  <Input
                    ref={inputPaymentConditions}
                    onChange={handlePaymentConditions}
                  />
                </Form.Item>
              </Col>
            )}
            <Col span={4}>
              <Form.Item
                label="Entrega"
                name="delivery"
                rules={[
                  {
                    required: true,
                    message: "Selecione a forma de entrega"
                  }
                ]}
              >
                <Select
                  placeholder="Selecione"
                  onSelect={(value) => handleDeliveryMethod(value)}
                >
                  <Option value="motoboy">Entrega motoboy</Option>
                  <Option value="pickup">Retirada</Option>
                  <Option value="other">Outro</Option>
                </Select>
              </Form.Item>
            </Col>
            {deliveryPickUp && (
              <Col span={3}>
                <Form.Item
                  label="Quem retira?"
                  name="pickupBy"
                  rules={[
                    { required: true, message: "Insira o nome do responsável" }
                  ]}
                >
                  <Input ref={inputPickupBy} onChange={handlePickupBy} />
                </Form.Item>
              </Col>
            )}
            {deliveryMethod === "Entrega Motoboy" && (
              <Col span={3}>
                <Form.Item
                  label="Valor do frete"
                  name="freightPrice"
                  rules={[
                    { required: true, message: "Insira o valor do frete" }
                  ]}
                >
                  <InputNumber
                    ref={inputFreightPrice}
                    onChange={(value) => handleFreightPrice(value)}
                    addonBefore="R$"
                    // formatter={(value) => currencyFormatter(value)}
                    formatter={(value) =>
                      value.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
                    }
                    parser={(value) => value?.replace(/\s?|(.*)/g, "")}
                  />
                </Form.Item>
              </Col>
            )}
          </Row>
          <Row>
            <Col span={7}>
              <Form.Item label="Observações" name="observations">
                <TextArea
                  ref={inputObservations}
                  rows={2}
                  onChange={handleOrderObservations}
                />
              </Form.Item>
            </Col>
          </Row>
        </Card>
        <Divider />
        <Card style={{ backgroundColor: "#ddfccf" }}>
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
              <OrderItemsTable
                items={selectedItems}
                setPricedItemsData={setPricedItemsData}
              />
              <Divider />
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <h2>
                Total de items: <strong>{selectedItems.length}</strong>
              </h2>
              <h2>
                Valor total dos itens:{" "}
                <strong>{currencyHelper(totalItemsPrice)}</strong>
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
            <Col span={8} style={{ backgroundColor: "#bafc9a", padding: 12 }}>
              <h2>
                Valor total: <strong>{currencyHelper(totalOrderPrice)}</strong>
              </h2>
              <h3>
                Forma de Pgto:{" "}
                <strong>
                  {paymentMethod.method}
                  {paymentMethod.conditions && (
                    <> - {paymentMethod.conditions}</>
                  )}
                </strong>
              </h3>
            </Col>
            <Divider />
          </Row>
          <Row>
            <Col span={12}>
              <Space>
                <Button icon={<SaveOutlined />}>Salvar pedido</Button>
                <Button icon={<PrinterOutlined />}>Imprimir cotação</Button>
              </Space>
            </Col>
            <Col
              span={12}
              style={{
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center"
              }}
            >
              <Space>
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={<CheckSquareOutlined />}
                >
                  Gerar pedido
                </Button>
              </Space>
            </Col>
          </Row>
        </Card>
      </Form>
    </>
  );
}

export default AddNewOrderForm;
