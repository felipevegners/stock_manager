import API from "../services/api"


const getItems = async (searchParams) => {
    try {
        const { data } = await API.get("/stock", {params: searchParams ? searchParams : {}});
        return data;
        
    } catch (error) {
        return error.message;
    }
}

const createItem = async (newItemData) => {
    try {
        const { data } = await API.post("/stock", newItemData);
        return data;

    } catch (error) {
        return error
    }
}

const updateItem = async (id, newItemData) => {
    try {
        const { data } = await API.put(`item/${id}`, newItemData);
        return data;

    } catch (error) {
        return error
    }
}

const deleteItem = async (itemId) => {
    try {
        const { data } = await API.delete(`item/${itemId}`);
        return data;

    } catch (error) {
        return error
    }
}

export {getItems, createItem, deleteItem, updateItem}