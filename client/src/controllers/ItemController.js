import API from "../services/api"


const getItems = async (searchParams) => {

    try {
        const { data } = await API.get("/stock", {params: searchParams ? searchParams : {}});
        return data;
        
    } catch (error) {
        return error
    }


}

export {getItems}