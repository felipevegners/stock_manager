export const currencyHelper = (value, locale, currency) => {
  return new Intl.NumberFormat(locale ? locale : "pt-BR", {
    style: "currency",
    currency: currency ? currency : "BRL"
  }).format(value);
};
