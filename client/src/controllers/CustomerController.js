import API from "../services/api"


const getCustomers = async (searchParams) => {
    try {
        const { data } = await API.get("/customer", {params: searchParams ? searchParams : {}});
        return data;
        
    } catch (error) {
        return error.message;
    }
}

const createCustomer = async (newCustomerData) => {
    try {
        const { data } = await API.post("/customer", newCustomerData);
        return data;

    } catch (error) {
        return error
    }
}

const updateCustomer = async (id, newCustomerData) => {
    try {
        const { data } = await API.put(`customer/${id}`, newCustomerData);
        return data;

    } catch (error) {
        return error
    }
}

const deleteCustomer = async (customerId) => {
    try {
        const { data } = await API.delete(`customer/${customerId}`);
        return data;

    } catch (error) {
        return error
    }
}

export {getCustomers, createCustomer, updateCustomer, deleteCustomer}