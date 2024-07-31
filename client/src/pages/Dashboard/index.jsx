import { useEffect, useState } from "react";
import API from "../../services/api";
import "./styles.css";

function Dashboard() {
  const [stock, setStock] = useState([]);

  // TODO: refac for better structure
  async function getStock() {
    const payload = await API.get("/stock");

    setStock(payload.data);
  }

  useEffect(() => {
    getStock();
  }, []);

  return (
    <>
      <table border={"1px"}>
        <thead>
          <tr>
            <th>IMEI</th>
            <th>Modelo</th>
            <th>Cor</th>
            <th>Capacidade</th>
          </tr>
        </thead>

        <tbody>
          {stock.map((stockItem) => (
            <tr key={stockItem.id}>
              <td>{stockItem.imei}</td>
              <td>{stockItem.model}</td>
              <td>{stockItem.color}</td>
              <td>{stockItem.capacity}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

export default Dashboard;
