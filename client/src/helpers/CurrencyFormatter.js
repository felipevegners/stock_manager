export const currencyFormatter = (value) => {
  let unmaskedValue = value;
  unmaskedValue = unmaskedValue.replace(/\D/g, ""); // Remove todos os não dígitos
  unmaskedValue = unmaskedValue.replace(/(\d+)(\d{2})$/, "$1,$2"); // Adiciona a parte de centavos
  unmaskedValue = unmaskedValue.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1."); // Adiciona pontos a cada três dígitos

  return unmaskedValue;
};
