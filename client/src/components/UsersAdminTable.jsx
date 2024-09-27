import { Checkbox, Table, Typography } from "antd";
import { useContext, useEffect } from "react";
import { UsersContext } from "../pages/Users/UsersContext";

function UsersAdminTable() {
  const { users, handleUpdateUserRoles, handleDeleteUser } =
    useContext(UsersContext);
  const roles = [
    {
      label: "Cliente",
      value: "view"
    },
    {
      label: "Vendedor",
      value: "seller"
    },
    {
      label: "Gerente",
      value: "manager"
    },
    {
      label: "Admin",
      value: "admin"
    }
  ];

  const onChange = (checkedValues, record) => {
    const updateUserRoles = {
      roles: checkedValues
    };

    handleUpdateUserRoles(record.id, updateUserRoles);
  };

  const columns = [
    {
      title: "Usuário",
      dataIndex: "name"
    },
    {
      title: "Permissões",
      render: (record) => {
        return (
          <Checkbox.Group
            options={roles}
            defaultValue={[...record.roles]}
            onChange={(value) => onChange(value, record)}
          />
        );
      }
    },
    {
      title: "Ações",
      render: (record) => {
        return (
          <>
            <Typography.Link
              onClick={() => handleDeleteUser(record.id)}
              style={{ color: "red" }}
            >
              Excluir
            </Typography.Link>
          </>
        );
      }
    }
  ];

  useEffect(() => {
    // console.log(users);
  }, []);
  return (
    <Table
      columns={columns}
      dataSource={users}
      rowKey={(record) => record.id}
    />
  );
}

export default UsersAdminTable;
