import API from "../services/api"


const getBatches = async (searchParams) => {
    try {
        const { data } = await API.get("/batch", {params: searchParams ? searchParams : {}});
        return data;
        
    } catch (error) {
        return error.message;
    }
}

const createBatch = async (newBatchdata) => {
    try {
        const { data } = await API.post("/batch", newBatchdata);
        return data;

    } catch (error) {
        return error
    }
}

const updateBatch = async (id, newBatchdata) => {
    try {
        const { data } = await API.put(`batch/${id}`, newBatchdata);
        return data;

    } catch (error) {
        return error
    }
}

const deleteBatch = async (batchId) => {
    try {
        const { data } = await API.delete(`batch/${batchId}`);
        return data;

    } catch (error) {
        return error
    }
}

export {getBatches, createBatch, updateBatch, deleteBatch}