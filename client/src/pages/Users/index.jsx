import { Button, Card, Divider, message, Modal, Space, Spin } from "antd";
import {
  deleteUser,
  getUsers,
  updateUserRoles
} from "../../controllers/UserController";
import { useEffect, useState } from "react";
import UsersAdminTable from "../../components/UsersAdminTable";
import { UsersContext } from "./UsersContext";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import RegisterForm from "../../components/RegisterForm";

function UsersAdmin() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [addUserModal, setAddUserModal] = useState(false);

  const fetchData = async () => {
    await getUsers().then((result) => {
      if (result?.response?.status === 400) {
        message.error("Erro ao carregar dados dos usuários. Tente novamente!");
      } else {
        setUsers(result);
        setTimeout(() => {
          setIsLoading(false);
        }, 1000);
      }
    });
  };

  const handleUpdateUserRoles = async (id, userRoles) => {
    await updateUserRoles(id, userRoles).then((result) => {
      if (result?.response?.status === 400) {
        message.error(
          "Erro ao atualizar permissões do usuário. Tente novamente!"
        );
      } else {
        message.success(result.message);
      }
    });
  };

  const handleDeleteUser = async (userId) => {
    const loggedUserId = localStorage.getItem("userId");

    if (loggedUserId !== userId) {
      await deleteUser(userId).then((result) => {
        if (result?.response?.status === 400) {
          message.error("Erro ao deletear o usuário. Tente novamente!");
        } else {
          setTimeout(() => {
            fetchData();
          }, 1000);
          console.log("message -> ", result.message);
          message.success("Usuário deletado com sucesso");
        }
      });
    } else {
      message.error("Seu usuário não pode ser removido!");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  return (
    <UsersContext.Provider
      value={{ users, handleUpdateUserRoles, handleDeleteUser }}
    >
      {isLoading ? (
        <Spin
          spinning={isLoading}
          indicator={<LoadingOutlined spin />}
          size="large"
        />
      ) : (
        <>
          <Space direction="horizontal" size="large" style={{ width: "100%" }}>
            <h1>Gerenciar Usuários</h1>
            <Button
              type="primary"
              size="large"
              onClick={() => setAddUserModal(true)}
              icon={<PlusOutlined />}
            >
              Novo usuário
            </Button>
          </Space>
          <Divider />
          <Modal
            open={addUserModal}
            onCancel={() => setAddUserModal(false)}
            footer={false}
          >
            <Card title="Cadastrar novo usuário">
              <RegisterForm />
            </Card>
          </Modal>
          <UsersAdminTable />
        </>
      )}
    </UsersContext.Provider>
  );
}

export default UsersAdmin;
