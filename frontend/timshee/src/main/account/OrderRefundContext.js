import React, { useEffect, useState } from "react";
import {createContext} from "react";

export const OrderDetailContext = createContext();

export const OrderDetailContextProvider = ({ children }) => {
    const [order, setOrder] = useState(null);

    const refundOrder = data => {
        console.log(data);
        setOrder(data);
    };

    return <OrderDetailContext.Provider value={{order, refundOrder}}>
        {children}
    </OrderDetailContext.Provider>;
};