/* eslint-disable react/prop-types */
import { Divider, Modal } from "antd";
import AddCustomerForm from "../../components/AddCustomerForm";

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
      footer={null}
      width={"85%"}
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
