export const getDate = () => {
    const today = new Date();
    const month = today.getMonth() + 1;
    const year = today.getFullYear();
    const date = today.getDate();
    return `${date}/${month}/${year}`
}

export const dateFormat = (date) => {
    return new Date(date).toLocaleDateString("pt-BR")
}