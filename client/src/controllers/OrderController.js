import API from "../services/api"


const getOrders = async (searchParams) => {
    try {
        const { data } = await API.get("/orders", {params: searchParams ? searchParams : {}});
        return data;
        
    } catch (error) {
        return error.message;
    }
}

const createOrder = async (newOrderData) => {
    try {
        const { data } = await API.post("/orders", newOrderData);
        return data;

    } catch (error) {
        return error
    }
}

const updateOrder = async (id, newOrderData) => {
    try {
        const { data } = await API.put(`order/${id}`, newOrderData);
        return data;

    } catch (error) {
        return error
    }
}

const cancelOrder = async (orderId) => {
    try {
        const { data } = await API.patch(`order/${orderId}`);
        return data;

    } catch (error) {
        return error
    }
}

export {getOrders, createOrder, updateOrder, cancelOrder}