import { Card, Space } from "antd";
import RegisterForm from "../../components/RegisterForm";

function Register() {
  return (
    <Space
      direction="vertical"
      style={{
        width: "100%",
        height: "100vh",
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      <h1 style={{ color: "#d3d3d3" }}>STOCK MANAGER</h1>
      <br />
      <Card title={<h4>Cadastrar novo usuário</h4>}>
        <RegisterForm />
      </Card>
    </Space>
  );
}

export default Register;
