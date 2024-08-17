/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { Popconfirm, Table, Typography, message, Divider } from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";
import { deleteCustomer } from "../../controllers/CustomerController";
import EditCustomerModal from "./EditCustomersModal";

const CustomersTable = ({ tableData, fetchData }) => {
  const [data, setData] = useState(tableData);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editCustomerData, setEditCustomerData] = useState({});

  const edit = (record) => {
    const dataToEdit = {
      id: record.id,
      name: record.name,
      phone: record.phone,
      email: record.email,
      street: record.street,
      stNumber: record.stNumber,
      stComplement: record.stComplement,
      city: record.city,
      state: record.state,
      zipCode: record.zipCode,
      observations: record.observations
    };
    setEditCustomerData(dataToEdit);
  };

  const showModal = (record) => {
    edit(record);
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const removeCustomer = async (id) => {
    setIsLoading(true);
    deleteCustomer(id).then((result) => {
      message.success(result.message);
    });
    setTimeout(() => {
      setIsLoading(false);
      fetchData();
    }, 1000);
  };

  const columns = [
    {
      title: "Nome",
      dataIndex: "name",
      editable: true,
      width: "10%"
    },
    {
      title: "Telefone",
      dataIndex: "phone",
      editable: true,
      with: "5%"
    },
    {
      title: "E-mail",
      dataIndex: "email",
      editable: true,
      width: "10%"
    },
    {
      title: "Endereço",
      dataIndex: [
        "street",
        "stNumber",
        "stComplement",
        "city",
        "state",
        "zipCode"
      ],
      editable: true,
      width: "30%",
      render: (text, record) => {
        return (
          <Typography.Text>
            Rua {record.street}, {record.stNumber}{" "}
            {record.stComplement.length > 0 ? ` - ${record.stComplement}` : ""}{" "}
            - {record.city} - {record.state} - CEP {record.zipCode}
          </Typography.Text>
        );
      }
    },
    {
      title: "Observações",
      dataIndex: "observations",
      editable: true,
      width: "20%",
      render: (text) => {
        return <>{text}</>;
      }
    },
    {
      title: "Ações",
      dataIndex: "operation",
      with: "5%",
      render: (_, record) => {
        return (
          <>
            <Typography.Link onClick={() => showModal(record)}>
              Editar
            </Typography.Link>
            <Divider type="vertical" />
            <Popconfirm
              title="Excluir produto"
              description="Tem certeza da exclusão?"
              icon={
                <QuestionCircleOutlined
                  style={{
                    color: "red"
                  }}
                />
              }
              cancelText="Cancelar"
              okText="Sim"
              okType="primary"
              onConfirm={() => removeCustomer(record.id)}
              okButtonProps={{
                loading: isLoading,
                danger: true
              }}
            >
              <a>Excluir</a>
            </Popconfirm>
          </>
        );
      }
    }
  ];

  useEffect(() => {
    setData(tableData);
  }, [tableData]);

  return (
    <>
      <Table
        bordered
        dataSource={data}
        columns={columns}
        pagination={{
          position: ["bottomCenter"]
        }}
        rowKey={(record) => record.id}
      />
      <EditCustomerModal
        isModalOpen={isModalOpen}
        handleCancel={handleCancel}
        customerDataToEdit={editCustomerData}
        fetchData={fetchData}
      />
    </>
  );
};
export default CustomersTable;
