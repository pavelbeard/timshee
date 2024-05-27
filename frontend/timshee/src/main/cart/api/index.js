// ORDERS
import {updateOrder} from "../../order/api/index";

const API_URL = process.env.REACT_APP_API_URL;
const csrftoken = localStorage.getItem("csrftoken");

export const createOrder = async ({ totalPrice, cartItems, isAuthenticated, setError, setIsLoading }) => {
    try {
        const copyItems = [...cartItems];
        const filteredItems = copyItems.map((item) => {
            const {colors, sizes, ...newItem} = item.stock.item;
            const stock = item.stock;
            return {...item, stock: {...stock, item: newItem}};
        });

        const body = {
            "ordered_items": {
                "data": filteredItems,
                "total_price": totalPrice,
            },
            "status": "pending_for_pay",
        };

        const url = isAuthenticated
            ? `${API_URL}api/order/orders/`
            : `${API_URL}api/order/anon-orders/`;

        const headers = isAuthenticated ? {
            "Content-Type": "application/json",
            "X-CSRFToken": csrftoken,
            "Accept": "application/json",
            "Authorization": `Token ${localStorage.getItem("token")}`,
        } : {
            "Content-Type": "application/json",
            "X-CSRFToken": csrftoken,
            "Accept": "application/json",
        };


        const response = await fetch(url, {
            method: "POST",
            headers,
            body: JSON.stringify(body),
            credentials: "include",
        });

        const result = await response.json();

        if (!('pending' in result)) {
            console.log("Created order: ", result);
            return result;
        } else {
            const updateCartItems = {...result.data, "ordered_items": {
                    data: cartItems,
                    total_price: totalPrice,
                }
            };
            const updatedOrder = await updateOrder({
                orderId: result.data.id,
                data: updateCartItems,
                isAuthenticated: isAuthenticated,
                setError: setError,
                setIsLoading: setIsLoading,
            });
            console.log("Updated order: ", updatedOrder);
            return updatedOrder;
        }
    } catch (error) {
        setError("Something went wrong: ", error.message);
    } finally {
        setIsLoading(false);
    }
};

