import { Layout } from "antd";
import Menu from "../../components/NavMenu";

const { Header, Content, Footer } = Layout;

function Dashboard() {
  return (
    <Layout>
      <Header style={{ display: "flex", alignItems: "center" }}>
        <div className="demo-logo" />
        <Menu />
      </Header>
      <Content style={{ padding: "36px" }}>
        <div>
          <h1>Dashboard</h1>
        </div>
      </Content>
      <Footer style={{ textAlign: "center" }}>
        Ant Design ©{new Date().getFullYear()} Created by Ant UED
      </Footer>
    </Layout>
  );
}

export default Dashboard;
