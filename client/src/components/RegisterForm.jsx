import { Button, Form, Input, Flex, Typography, Divider, message } from "antd";
import { useNavigate } from "react-router-dom";
import { userRegister } from "../controllers/UserController";
import { useState } from "react";

function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegisterUser = async (values) => {
    setIsLoading(true);
    const { name, email, password, passwordConfirm } = values;
    if (password !== passwordConfirm) {
      message.error("As senhas não conferem. Tente novamente");
      setIsLoading(false);
    } else {
      const userData = {
        name: name,
        email: email,
        password: password,
        roles: []
      };
      setIsLoading(false);
      await userRegister(userData).then((result) => {
        if (result?.response?.status === 400) {
          message.error("Usuário não cadastrado. Tente novamente.");
        } else {
          message.success("Usuário cadastrado com sucesso!");
          setTimeout(() => {
            setIsLoading(false);
            navigate("/login");
          }, 1000);
        }
      });
    }
  };

  const onFinish = (values) => {
    handleRegisterUser(values);
  };

  return (
    <Form
      name="login"
      initialValues={{
        remember: true
      }}
      // style={{
      //   maxWidth: 360
      // }}
      onFinish={onFinish}
    >
      <Form.Item
        name="name"
        rules={[
          {
            required: true,
            message: "Por favor, insira um nome de usuário!"
          }
        ]}
      >
        <Input placeholder="Nome de usuário" size="large" />
      </Form.Item>
      <Form.Item
        name="email"
        rules={[
          {
            required: true,
            message: "Por favor, insira um e-mail válido!"
          }
        ]}
      >
        <Input placeholder="E-mail" size="large" />
      </Form.Item>
      <Form.Item
        name="password"
        rules={[
          {
            required: true,
            message: "Por favor, insira uma senha!"
          }
        ]}
      >
        <Input.Password placeholder="Senha" size="large" />
      </Form.Item>
      <Form.Item
        name="passwordConfirm"
        rules={[
          {
            required: true,
            message: "Por favor, insira a confirmação de senha!"
          }
        ]}
      >
        <Input.Password
          type="password"
          placeholder="Confirme a senha"
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
          Cadastrar usuário
        </Button>
      </Form.Item>
      <Divider />
      <Flex vertical justify="center" align="center">
        <Typography>Já possui um cadastro? </Typography>
        <Typography.Link onClick={() => navigate("/login")}>
          Fazer login
        </Typography.Link>
      </Flex>
    </Form>
  );
}

export default RegisterForm;
