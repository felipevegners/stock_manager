export const currencyHelper = (value) => {
        return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL"}).format(value ? value : 0.00);

}