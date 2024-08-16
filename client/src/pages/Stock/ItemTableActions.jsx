import { Typography, Divider, Popconfirm } from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";

const ItemTableActions = (
  isEditing,
  isLoading,
  editingKey,
  save,
  cancel,
  edit
) => ({
  title: "Ação",
  dataIndex: "operation",
  render: (_, record) => {
    const editable = isEditing(record);
    return editable ? (
      <>
        <Typography.Link onClick={() => save(record.id)}>
          Salvar
        </Typography.Link>
        <Divider type="vertical" />
        <Typography.Link
          onClick={cancel}
          style={{
            marginInlineEnd: 8
          }}
        >
          Cancelar
        </Typography.Link>
      </>
    ) : (
      <>
        <Typography.Link
          disabled={editingKey !== ""}
          onClick={() => edit(record)}
        >
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
          okType="danger"
          //   onConfirm={() => removeItem(record.id)}
          okButtonProps={{
            loading: isLoading
          }}
        >
          <a>Excluir</a>
        </Popconfirm>
      </>
    );
  }
});

export default ItemTableActions;
