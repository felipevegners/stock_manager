/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useContext } from "react";
import { Button, Table } from "antd";
import { currencyHelper } from "../helpers/CurrencyHelper";
import { OrderContext } from "../pages/Orders/OrderContext";
import { PlusOutlined } from "@ant-design/icons";

const OrderItemsTable = () => {
  const { itemsAvailable, selectedItems, setSelectedItems } =
    useContext(OrderContext);

  const itemsColumns = [
    {
      title: "Lote",
      dataIndex: "batch",
      render: (record) => {
        return <>{record.name}</>;
      }
    },
    {
      title: "IMEI",
      dataIndex: "imei"
    },
    {
      title: "Modelo",
      dataIndex: "model"
    },
    {
      title: "Cor",
      dataIndex: "color"
    },
    {
      title: "Capacidade",
      dataIndex: "capacity",
      render: (text) => {
        return <>{text} GB</>;
      }
    },
    {
      title: "Bateria",
      dataIndex: "battery",
      render: (text) => {
        return <>{text}%</>;
      }
    },
    {
      title: "Detalhes",
      dataIndex: "details",
      width: "15%"
    },
    {
      title: "Preço Custo",
      dataIndex: "totalCosts",
      width: "8%",
      render: (text) => {
        return currencyHelper(text);
      }
    },
    {
      title: "Ação",
      render: (record) => {
        return (
          <Button
            icon={<PlusOutlined />}
            size="medium"
            type="primary"
            disabled={handleDisableButton(record.id)}
            onClick={() => handleAddSelectedItem(record)}
          >
            Adicionar
          </Button>
        );
      }
    }
  ];

  const handleAddSelectedItem = (record) => {
    const newItem = {
      id: record.id,
      batch: record.batch,
      imei: record.imei,
      model: record.model,
      color: record.color,
      capacity: record.capacity,
      battery: record.battery,
      details: record.details,
      totalCosts: record.totalCosts,
      sellPrice: record.sellPrice
    };
    setSelectedItems([...selectedItems, newItem]);
  };

  const handleDisableButton = (itemId) => {
    return selectedItems.find((el) => el.id === itemId);
  };

  return (
    <>
      <Table
        bordered
        dataSource={itemsAvailable}
        columns={itemsColumns}
        rowKey={(record) => record.id}
      />
    </>
  );
};
export default OrderItemsTable;
