/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useContext, useEffect, useRef, useState } from "react";
import {
  Button,
  Form,
  Row,
  Col,
  Card,
  Divider,
  Input,
  Select,
  Space,
  message,
  InputNumber
} from "antd";

const { TextArea } = Input;
import { OrderContext } from "../pages/Orders/OrderContext";

import {
  CloseOutlined,
  PrinterOutlined,
  SaveOutlined,
  CheckCircleOutlined
} from "@ant-design/icons";

import PricedItemsTable from "./PricedItemsTable";
import OrderItemsTable from "./OrderItemsTable";
import MaskedInput from "./MaskedInput";
import { useReactToPrint } from "react-to-print";

const { Option } = Select;

function AddNewOrderForm({ children }) {
  const {
    customersList,
    setAddNewOrderForm,
    newOrderNum,
    selectedItems,
    setSelectedItems,
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
  const [totalItemsPrice, setTotalItemsPrice] = useState(null);
  const [totalOrderPrice, setTotalOrderPrice] = useState(null);
  const [orderProfit, setOrderProfit] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState({});
  const [orderStatus, setOrderStatus] = useState(null);
  const [orderObservations, setOrderObservations] = useState("");

  const inputCustomerName = useRef();
  const inputPickupBy = useRef();
  const inputFreightPrice = useRef();
  const inputPaymentConditions = useRef();
  const inputObservations = useRef();

  const [form] = Form.useForm();

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
    if (selectedItems.length > 0) {
      const totalItemsPrice = selectedItems?.reduce((acc, obj) => {
        return acc + obj.sellPrice;
      }, 0);

      const totalOrder = totalItemsPrice + freigtPrice;

      setTotalItemsPrice(totalItemsPrice);
      setTotalOrderPrice(totalOrder);

      const totalItemsCosts = selectedItems?.reduce((acc, obj) => {
        return acc + obj.totalCosts;
      }, 0);

      const totalOrderProfit = totalItemsPrice - totalItemsCosts;
      setOrderProfit(totalOrderProfit.toFixed(2));
    } else {
      setTotalItemsPrice(0);
      setTotalOrderPrice(0);
    }
  };

  const handleOrderObservations = (e) => {
    setOrderObservations(e.target.value);
  };

  const addNewOrder = async (values) => {
    const newOrderData = {
      orderNum: newOrderNum,
      customer: selectedCustomer,
      items: selectedItems,
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
          setSelectedItems([]);
          fetchData();
        }, 1000);
        handleItemsAvailability(newOrderData.items, "new order");
      }
    });
  };

  const onFinish = (values) => {
    addNewOrder(values);
  };
  // Print Order Function and Config
  const componentRef = useRef(null);
  const printFn = useReactToPrint({
    contentRef: componentRef,
    documentTitle: `Pedido ${newOrderNum} - ${selectedCustomer[0].name}`,
    suppressErrors: true
  });

  useEffect(() => {
    if (selectedItems?.length > 0) {
      calculateOrderPrice();
    }
  }, [selectedItems, totalOrderPrice, freigtPrice, orderStatus]);

  return (
    <>
      <Form form={form} layout="vertical" onFinish={onFinish} size="large">
        <Card
          title={<h3>Novo pedido</h3>}
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
              <h2>1 - Dados do cliente</h2>
              <br />
              <Form.Item
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
                  allowClear
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
              <h2>2 - Selecione os produtos</h2>
              <Divider />
              <OrderItemsTable />
            </Col>
            <Col span={24}>
              <h2>3 - Insira o valor de venda</h2>
              <Divider />
              <PricedItemsTable
                setTotalItemsPrice={setTotalItemsPrice}
                setTotalOrderPrice={setTotalOrderPrice}
              />
              <br />
            </Col>
            <Col span={24}>
              <h2>4 - Frete e Pagamento</h2>
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
                  allowClear
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
                    allowClear
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
                  allowClear
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
                  <Input
                    ref={inputPickupBy}
                    onChange={handlePickupBy}
                    allowClear
                  />
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
                  <MaskedInput
                    refInput={inputFreightPrice}
                    onChange={(value) => handleFreightPrice(value)}
                    customInput={Input}
                    type="numeric"
                    prefix="R$"
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
                  allowClear
                />
              </Form.Item>
            </Col>
          </Row>
        </Card>
        <Divider />
        <div ref={componentRef}>
          {React.cloneElement(children, {
            newOrderNum,
            selectedCustomer,
            deliveryMethod,
            pickupBy,
            orderObservations,
            freigtPrice,
            paymentMethod,
            selectedItems,
            totalItemsPrice,
            totalOrderPrice
          })}
        </div>
        <Divider />
        <Row>
          <Col span={12}>
            <Space>
              {/* <Button disabled icon={<SaveOutlined />}>
                Salvar pedido
              </Button> */}

              <Button
                onClick={printFn}
                icon={<PrinterOutlined />}
                disabled={totalItemsPrice === 0 || totalItemsPrice === null}
              >
                Imprimir cotação
              </Button>
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
                icon={<CheckCircleOutlined />}
                disabled={totalItemsPrice === 0 || totalItemsPrice === null}
              >
                Gerar pedido
              </Button>
            </Space>
          </Col>
        </Row>
      </Form>
    </>
  );
}

export default AddNewOrderForm;
