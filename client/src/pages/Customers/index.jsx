import { Space, Button, Divider, Card, Spin, message } from "antd";
import {
  CloseOutlined,
  LoadingOutlined,
  PlusOutlined
} from "@ant-design/icons";
import AddCustomerForm from "../../components/AddCustomerForm";
import CustomersTable from "../../components/CustomersTable";

import { getCustomers } from "../../controllers/CustomerController";
import { useEffect, useState } from "react";

function Customers() {
  const [customers, setCustomers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddNewCustomer, setShowAddNewCustomer] = useState(false);

  const fetchData = () => {
    getCustomers().then((result) => {
      if (result?.response?.status === 400) {
        message.error("Erro ao carregar os dados.");
      } else {
        setCustomers(result);
        setTimeout(() => {
          setIsLoading(false);
        }, 1000);
      }
    });
  };

  useEffect(() => {
    fetchData();
  }, []);
  return (
    <>
      <Space direction="horizontal" size="large" style={{ width: "100%" }}>
        <h1>Clientes Ativos</h1>
        <Button
          type="primary"
          size="large"
          onClick={() => setShowAddNewCustomer(true)}
          icon={<PlusOutlined />}
        >
          Novo cliente
        </Button>
      </Space>
      {showAddNewCustomer && (
        <>
          <Divider />
          <Space
            size="large"
            direction="vertical"
            style={{ display: "flex", transition: "all 0.6s ease-in" }}
          >
            <Card
              title="Cadastrar novo cliente"
              extra={
                <CloseOutlined onClick={() => setShowAddNewCustomer(false)} />
              }
            >
              <AddCustomerForm
                fetchData={fetchData}
                setShowAddNewCustomer={setShowAddNewCustomer}
              />
            </Card>
          </Space>
        </>
      )}
      <Divider />
      <Space direction="vertical" size={"large"} style={{ width: "100%" }}>
        {isLoading ? (
          <Spin
            spinning={isLoading}
            indicator={<LoadingOutlined spin />}
            size="large"
          />
        ) : (
          <CustomersTable tableData={customers} fetchData={fetchData} />
        )}
      </Space>
    </>
  );
}

export default Customers;
