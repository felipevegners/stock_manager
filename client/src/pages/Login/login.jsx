import { Card, Space } from "antd";
import LoginForm from "../../components/LoginForm";
function Login() {
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
      <Card style={{ minWidth: 380 }} title={<h4>Acesso o sistema</h4>}>
        <LoginForm />
      </Card>
    </Space>
  );
}

export default Login;
