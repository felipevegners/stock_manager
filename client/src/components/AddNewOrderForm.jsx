/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useContext, useEffect, useRef, useState } from "react";
import {
  Button,
  Form,
  Row,
  Col,
  Divider,
  Input,
  Select,
  Table,
  Space,
  Checkbox
} from "antd";
import { OrderContext } from "../pages/Orders/OrderContext";

import { getDate } from "../helpers/DateHelper";

const { Option } = Select;

function AddNewOrderForm() {
  const { customersList, itemsAvailable } = useContext(OrderContext);

  const [currentDate, setCurrentDate] = useState(getDate());
  const [isFuturePayment, setIsFuturePayment] = useState(false);
  const [deliveryPickUp, setDeliveryPickUp] = useState(false);
  const [deliveryMethod, setDeliveryMethod] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState([]);
  const [pickupBy, setPickupBy] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);
  const [stockItems, setStockItems] = useState([]);

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
        return <>R$ {new Intl.NumberFormat("pt-BR").format(text)}</>;
      }
    },
    {
      title: "Taxa",
      dataIndex: "tax",
      with: "5%",
      render: (text) => {
        return <>R$ {new Intl.NumberFormat("pt-BR").format(text)}</>;
      }
    },
    {
      title: "Margem",
      dataIndex: "tax",
      with: "5%",
      render: (text) => {
        return <>R$ {new Intl.NumberFormat("pt-BR").format(text)}</>;
      }
    },
    {
      title: "Valor",
      dataIndex: "tax",
      with: "5%",
      render: (text, record) => {
        return (
          <>
            R${" "}
            {new Intl.NumberFormat("pt-BR").format(
              record.unitPrice * record.tax
            )}
          </>
        );
      }
    }
  ];

  const finalColumns = [
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
      title: "Valor",
      dataIndex: "tax",
      with: "5%",
      render: (record) => {
        return (
          <>
            R${" "}
            {new Intl.NumberFormat("pt-BR").format(
              record.unitPrice * record.tax
            )}
          </>
        );
      }
    }
  ];

  const inputCustomerName = useRef();
  const inputPickupBy = useRef();

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

  const handlePaymentForm = (value) => {
    if (value === "a prazo") setIsFuturePayment(true);
    else setIsFuturePayment(false);
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

  const handlePickupBy = (e) => {
    e.preventDefault;
    setPickupBy(e.target.value);
  };

  useEffect(() => {
    console.log("selected items ", selectedItems);
    addKey();
  }, [selectedItems]);

  return (
    <>
      <Space size="large">
        <h2>Tipo de pedido:</h2>
        <Checkbox style={{ fontSize: 18, fontWeight: "bolder" }}>
          Pedido de Orçamento
        </Checkbox>
        <Checkbox style={{ fontSize: 18, fontWeight: "bolder" }}>
          Pedido de venda
        </Checkbox>
      </Space>
      <Divider />
      <Form form={form} layout="vertical" onFinish={onFinish} size="large">
        <Row
          gutter={{
            xs: 8,
            sm: 16,
            md: 24,
            lg: 32
          }}
        >
          <Col span={24}>
            <h2>Dados do cliente</h2>
            <Divider />
          </Col>
          <Col span={6}>
            <Form.Item
              label="Cliente"
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
            <Col span={6}>
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
                <Input />
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
              <Form.Item label="Quem retira?" name="pickupBy">
                <Input ref={inputPickupBy} onChange={handlePickupBy} />
              </Form.Item>
            </Col>
          )}

          <Col span={24}>
            <h2>
              Itens do pedido:{" "}
              {hasSelected
                ? `${selectedItems.length} produtos selecionados`
                : null}
            </h2>
            <Divider />
            <h2></h2>
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
        </Row>
        <Row>
          <h1>Resumo do Pedido</h1>
          <Divider />
          <Col span={11}>
            <Space size="small" direction="vertical">
              <h1>Pedido #0001</h1>
              <h3>Data do pedido: {currentDate}</h3>
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
                  Endereço:{" "}
                  {selectedCustomer &&
                    selectedCustomer.map((customer) => (
                      <span key={customer.id}>
                        {customer.street}, {customer.stNumber} - {customer.city}{" "}
                        - {customer.state}
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
          <Col span={10}>
            <h2>Total de items: {selectedItems.length}</h2>
            <h3>Valor total dos itens: R$ 34.267,89</h3>
          </Col>
          <Col span={10}>
            <h3>Valor do frete: R$ 200,00</h3>
          </Col>
          <Col span={4} style={{ backgroundColor: "#ccc", padding: 8 }}>
            <h2>Valor total: R$ 34.567,89</h2>
            <h3>Forma de pagamento: </h3>
          </Col>
          <Divider />
        </Row>
        <Row>
          <Col span={24}>
            <Space>
              <Button type="primary">Imprimir cotação</Button>
              <Button type="primary" htmlType="submit">
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
