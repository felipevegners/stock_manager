import { useEffect, useState } from "react";
import API from "../../services/api";

import { Table } from "antd";

const columns = [
  {
    title: "IMEI",
    dataIndex: "imei",
    key: "imei"
  },
  {
    title: "Modelo",
    dataIndex: "model",
    showSorterTooltip: {
      target: "model"
    },
    onFilter: (value, record) => record.model.indexOf(value) === 0
    // sorter: (a, b) => a.model.length - b.model.length,
    // sortDirections: ["ascend"]
  },
  {
    title: "Cor",
    dataIndex: "color",
    key: "color"
  },
  {
    title: "Capacidade",
    dataIndex: "capacity",
    defaultSortOrder: "ascend",
    sorter: (a, b) => a.capacity - b.capacity
  },
  {
    title: "Condição",
    dataIndex: "condition",
    key: "condition"
  },
  {
    title: "Quantidade",
    dataIndex: "qty",
    key: "qty"
  },
  {
    title: "Preço Unitário",
    dataIndex: "unitPrice",
    key: "unitPrice"
  },
  {
    title: "Taxa",
    dataIndex: "tax",
    key: "tax"
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status"
  },
  {
    title: "Valor total",
    key: "totalValue"
  },
  {
    title: "Disponível",
    dataIndex: "isAvailable",
    key: "isAvailable"
  }
];

function Stock() {
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
      <h1>Estoque</h1>
      <hr style={{ marginBottom: 16 }} />
      <input type="search" name="findItem" id="" />
      <button type="submit">Buscar produto</button>
      <p>Buscar por</p>
      <ul>
        <li>
          <input type="checkbox" name="imei" id="" />
          <label>IMEI</label>
        </li>
        <li>
          <input type="checkbox" name="modelo" id="" />
          <label>Modelo</label>
        </li>
        <li>
          <input type="checkbox" name="cor" id="" />
          <label>Cor</label>
        </li>
        <li>
          <input type="checkbox" name="capacidade" id="" />
          <label>Capacidade</label>
        </li>
      </ul>
      <button type="button">Editar produtos</button>
      <button type="button">Deletar produto</button>
      <Table
        dataSource={stock}
        columns={columns}
        showSorterTooltip={{
          target: "sorter-icon"
        }}
        size="middle"
        pagination={false}
        bordered
      />
    </>
  );
}

export default Stock;
