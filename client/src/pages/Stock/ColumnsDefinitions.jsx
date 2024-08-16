const ItemColums = [
  {
    title: "IMEI",
    dataIndex: "imei",
    editable: true,
    width: "10%"
  },
  {
    title: "Modelo",
    dataIndex: "model",
    editable: true,
    with: "10%"
  },
  {
    title: "Cor",
    dataIndex: "color",
    editable: true,
    width: "8%"
  },
  {
    title: "Capacidade",
    dataIndex: "capacity",
    editable: true,
    width: "5%",
    render: (text) => {
      return <>{text} GB</>;
    }
  },
  {
    title: "Bateria",
    dataIndex: "battery",
    editable: true,
    width: "5%",
    render: (text) => {
      return <>{text}%</>;
    }
  },
  {
    title: "Detalhes",
    dataIndex: "details",
    editable: true,
    width: "15%"
  },
  {
    title: "Custo",
    dataIndex: "unitPrice",
    editable: true,
    width: "8%",
    render: (text) => {
      return <>R$ {new Intl.NumberFormat("pt-BR").format(text)}</>;
    }
  },
  {
    title: "Taxa",
    dataIndex: "tax",
    editable: true,
    with: "5%",
    render: (text) => {
      return <>R$ {new Intl.NumberFormat("pt-BR").format(text)}</>;
    }
  },
  {
    title: "Status",
    dataIndex: "status",
    editable: true,
    width: "10%"
  }
];

export default ItemColums;
