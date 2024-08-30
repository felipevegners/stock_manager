/* eslint-disable react/prop-types */
import { Divider, Modal, Space, Button } from "antd";
import AddCustomerForm from "./AddCustomerForm";
import { CloseOutlined } from "@ant-design/icons";

const EditCustomerModal = ({
  handleCancel,
  customerDataToEdit,
  isModalOpen,
  fetchData
}) => {
  return (
    <Modal
      open={isModalOpen}
      onCancel={handleCancel}
      width={"85%"}
      footer={
        <Space>
          <Button
            type="primary"
            icon={<CloseOutlined />}
            onClick={handleCancel}
          >
            Fechar
          </Button>
        </Space>
      }
    >
      <h2>Atualizar cadastro</h2>
      <Divider />
      <AddCustomerForm
        customerDataToEdit={customerDataToEdit}
        fetchData={fetchData}
        handleCancel={handleCancel}
      />
      <br />
    </Modal>
  );
};

export default EditCustomerModal;
