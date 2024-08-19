import { createContext } from "react";
import { getCustomers } from "../controllers/CustomerController";

const getCustomersFromAPI = () => {
    getCustomers().then((result) => {
        return result
    })
}


export const CustomersContext = createContext(getCustomersFromAPI())
