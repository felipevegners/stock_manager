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
  Checkbox,
  Typography
} from "antd";

const { Title, Text } = Typography;
import { OrderContext } from "../pages/Orders/OrderContext";

import { getDate } from "../helpers/DateHelper";
import { currencyHelper } from "../helpers/CurrencyHelper";
import {
  CloseOutlined,
  CheckSquareOutlined,
  PrinterOutlined,
  SaveOutlined
} from "@ant-design/icons";

const { Option } = Select;

function AddNewOrderForm() {
  const { customersList, itemsAvailable, setAddNewOrderForm } =
    useContext(OrderContext);

  const [currentDate, setCurrentDate] = useState(getDate());
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

  const [form] = Form.useForm();

  const itemsColumns = [
    {
      title: "IMEI",
      dataIndex: "imei",
      width: "10%"
    },
    {
      title: "Modelo",
      dataIndex: "model",
      with: "10%"
    },
    {
      title: "Cor",
      dataIndex: "color",
      width: "8%"
    },
    {
      title: "Capacidade",
      dataIndex: "capacity",
      width: "5%",
      render: (text) => {
        return <>{text} GB</>;
      }
    },
    {
      title: "Bateria",
      dataIndex: "battery",
      width: "5%",
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
      title: "Custo",
      dataIndex: "unitPrice",
      width: "8%",
      render: (text) => {
        return (
          <>
            {new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL"
            }).format(text)}
          </>
        );
      }
    },
    {
      title: "Taxa",
      dataIndex: "tax",
      with: "5%",
      render: (text) => {
        return (
          <>
            {" "}
            {new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL"
            }).format(text)}
          </>
        );
      }
    },
    {
      title: "Margem",
      dataIndex: "profit",
      with: "5%",
      render: (text) => {
        return (
          <>
            {" "}
            {new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL"
            }).format(text)}
          </>
        );
      }
    },
    {
      title: "Valor Venda",
      with: "5%",
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

  const finalColumns = [
    {
      title: "Produto",
      dataIndex: ["imei", "model", "color", "capacity", "battery"],
      render: (_, record) => {
        return (
          <Typography.Text>
            {record.imei} - {record.model} - {record.color} - {record.capacity}
            GB - Bateria {record.battery}%
          </Typography.Text>
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

  const inputCustomerName = useRef();
  const inputPickupBy = useRef();
  const inputFreightPrice = useRef();
  const inputPaymentConditions = useRef();

  const addKey = () => {
    const itemsWithKey = itemsAvailable.map((v, index) => ({
      ...v,
      key: index
    }));

    setStockItems(itemsWithKey);
  };

  const rowSelection = {
    onChange: (_, selectedRows) => {
      setSelectedItems(selectedRows);
    }
  };
  const hasSelected = selectedItems.length > 0;

  const onFinish = () => {
    console.log(inputCustomerName.current.nativeElement.innerText);
  };

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
      setIsFuturePayment(true);
      console.log(value, isFuturePayment);
      setPaymentMethod({ ...paymentMethod, method: "A prazo" });
    } else if (value === "a pagar") {
      setIsFuturePayment(false);
      setPaymentMethod({ ...paymentMethod, method: "A pagar" });
    } else {
      setIsFuturePayment(false);
      setPaymentMethod({ ...paymentMethod, method: "Pago" });
    }
  };

  const handleDeliveryMethod = (value) => {
    if (value === "pickup") {
      setDeliveryMethod("Retirada");
      setDeliveryPickUp(true);
    } else if (value === "motoboy") {
      setDeliveryMethod("Entrega Motoboy");
      setDeliveryPickUp(false);
    } else {
      setDeliveryMethod("Entrega - Outro");
      setDeliveryPickUp(false);
    }
  };

  const handleFreightPrice = (e) => {
    e.preventDefault();
    if (e.target.value) setFreightPrice(e.target.value);
    else setFreightPrice(0);
  };

  const handlePickupBy = (e) => {
    e.preventDefault();
    setPickupBy(e.target.value);
  };

  const calculateOrderPrice = () => {
    const totalUnitPrice = selectedItems?.reduce((acc, obj) => {
      return acc + obj.unitPrice;
    }, 0);

    const totalProfit = selectedItems?.reduce((acc, obj) => {
      return acc + obj.profit;
    }, 0);

    const itemsTotal = totalUnitPrice + totalProfit;
    const orderTotal = itemsTotal + parseFloat(freigtPrice, 2);

    setTotalItemsPrice(itemsTotal);
    setTotalOrderPrice(orderTotal);
  };

  useEffect(() => {
    console.log("selected items ", selectedItems);
    calculateOrderPrice();
    addKey();
  }, [selectedItems]);

  return (
    <>
      <Form form={form} layout="vertical" onFinish={onFinish} size="large">
        <Card
          title={<h3>Dados do cliente:</h3>}
          extra={<CloseOutlined onClick={() => setAddNewOrderForm(false)} />}
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
            <Col span={6}>
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
                  <Option value="pago">Pago</Option>
                  <Option value="a pagar">A pagar</Option>
                  <Option value="a prazo">A prazo</Option>
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
            <Col span={6}>
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
                  <Input
                    ref={inputFreightPrice}
                    onChange={handleFreightPrice}
                    addonBefore="R$"
                    step="0.01"
                  />
                </Form.Item>
              </Col>
            )}
          </Row>
        </Card>
        <Divider />
        <Card>
          <Row>
            <h2>Resumo do Pedido</h2>
            <Divider />
            <Col span={11}>
              <Space size="small" direction="vertical">
                <h1>Pedido #0001</h1>
                <h3>
                  <strong>Data do pedido:</strong> {currentDate}
                </h3>
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
              <Table
                columns={finalColumns}
                dataSource={selectedItems}
                pagination={false}
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
            </Col>
            <Col span={8} style={{ backgroundColor: "#ddd", padding: 12 }}>
              <h2>
                Valor total: <strong>{currencyHelper(totalOrderPrice)}</strong>
              </h2>
              <h3>
                Pagamento:{" "}
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