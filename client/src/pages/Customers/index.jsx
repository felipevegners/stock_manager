import { Space, Button, Divider, Card, Spin } from "antd";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import AddCustomerForm from "../../components/AddCustomerForm";
import CustomersTable from "./CustomersTable";

import { getCustomers } from "../../controllers/CustomerController";
import { useEffect, useState } from "react";
import { AxiosError } from "axios";

function Customers() {
  const [customers, setCustomers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = () => {
    getCustomers().then((result) => {
      // TODO: Refac this error method
      if (result instanceof AxiosError) {
        console.log("result ---> ", result.message);
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
          onClick={() => {}}
          icon={<PlusOutlined />}
        >
          Novo cliente
        </Button>
      </Space>
      <Divider />
      <Space align="start">
        <Card>
          {isLoading ? (
            <Spin
              spinning={isLoading}
              indicator={<LoadingOutlined spin />}
              size="large"
            />
          ) : (
            <CustomersTable tableData={customers} />
          )}
        </Card>
        <Card>
          <h2>Cadastrar Cliente</h2>
          <br />
          <AddCustomerForm />
        </Card>
      </Space>
    </>
  );
}

export default Customers;
