/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useContext, useRef, useState } from "react";
import { Button, Input, Space, Table } from "antd";
import { currencyHelper } from "../helpers/CurrencyHelper";
import { OrderContext } from "../pages/Orders/OrderContext";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";

const OrderItemsTable = () => {
  const { itemsAvailable, selectedItems, setSelectedItems } =
    useContext(OrderContext);

  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };

  const getColumnSearchProps = (dataIndex, name) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close
    }) => (
      <div
        style={{
          padding: 8
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Buscar por ${name}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: "block"
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90
            }}
          >
            Buscar
          </Button>
          <Button
            onClick={() => {
              clearFilters;
              handleReset(clearFilters);
            }}
            size="small"
            style={{
              width: 90
            }}
          >
            Limpar
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({
                closeDropdown: false
              });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filtrar
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
              handleSearch(selectedKeys, confirm, dataIndex);
            }}
          >
            Fechar
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? "#1677ff" : undefined
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: "#ffc069",
            padding: 0
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      )
  });

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
      dataIndex: "imei",
      ...getColumnSearchProps("imei", "IMEI")
    },
    {
      title: "Modelo",
      dataIndex: "model",
      ...getColumnSearchProps("model", "Modelo")
    },
    {
      title: "Cor",
      dataIndex: "color",
      ...getColumnSearchProps("color", "Cor")
    },
    {
      title: "Capacidade",
      dataIndex: "capacity",
      filters: [
        {
          text: "64 GB",
          value: "64"
        },
        {
          text: "128 GB",
          value: "128"
        },
        {
          text: "256 GB",
          value: "256"
        },
        {
          text: "512 GB",
          value: "512"
        }
      ],
      onFilter: (value, record) => record.capacity.startsWith(value),
      filterSearch: true,
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
      sorter: (a, b) => a.totalCosts - b.totalCosts,
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
            size="small"
            type="primary"
            ghost
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
