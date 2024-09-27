import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Form, Input, Flex, Typography, Divider } from "antd";
import AuthContext from "../context/AuthContext";

const LoginForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const onFinish = (values) => {
    setIsLoading(true);
    const { email, password } = values;
    setTimeout(() => {
      login(email, password);
      setIsLoading(false);
      navigate("/");
    }, 1500);
  };
  return (
    <Form
      name="login"
      initialValues={{
        remember: true
      }}
      style={{
        maxWidth: 360
      }}
      onFinish={onFinish}
    >
      <Form.Item
        name="email"
        rules={[
          {
            required: true,
            message: "Por favor, insira o e-mail cadastrado!"
          }
        ]}
      >
        <Input prefix={<UserOutlined />} placeholder="E-mail" size="large" />
      </Form.Item>
      <Form.Item
        name="password"
        rules={[
          {
            required: true,
            message: "Por favor, insira sua senha!"
          }
        ]}
      >
        <Input.Password
          prefix={<LockOutlined />}
          placeholder="Senha"
          size="large"
        />
      </Form.Item>
      <Form.Item>
        <Button
          block
          type="primary"
          htmlType="submit"
          size="large"
          loading={isLoading}
        >
          Fazer Login
        </Button>
      </Form.Item>
      <Divider />
      <Flex vertical justify="center" align="center">
        <Typography>Não possui acesso?</Typography>
        <Typography.Link onClick={() => navigate("/register")}>
          Cadastrar novo usuário
        </Typography.Link>
      </Flex>
    </Form>
  );
};
export default LoginForm;
