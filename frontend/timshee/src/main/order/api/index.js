import {setError, setIsLoading} from "./checkoutSlice";

const API_URL = process.env.REACT_APP_API_URL;
const csrftoken = localStorage.getItem("csrftoken");

// ORDERS
export const getOrder = async ({ orderId, isAuthenticated, dispatch }) => {
    try {
        const url = isAuthenticated
            ? `${API_URL}api/order/orders/${orderId}/`
            : `${API_URL}api/order/anon-order/${orderId}/`;
        const headers = isAuthenticated ? {
            "Content-Type": "application/json",
            "Authorization": `Token ${localStorage.getItem("token")}`,
            "Accept": "application/json",
        } : {
            "Content-Type": "application/json",
            "Accept": "application/json",
        };

        const response = await fetch(url, {
            method: "GET",
            headers,
            credentials: "include",
        });

        if (response.ok) {
            return await response.json();
        }
    } catch (e) {
        dispatch(setError("Something went wrong: ", e.message));
    } finally {
        dispatch(setIsLoading(false));
    }
};

export const updateOrder = async ({ orderId, data, isAuthenticated, setError, setIsLoading }) => {
    try {
        const url = isAuthenticated
            ? `${API_URL}api/order/orders/${orderId}/`
            : `${API_URL}api/order/anon-orders/${orderId}/`;

        const headers = isAuthenticated ? {
            "Content-Type": "application/json",
            "X-CSRFToken": csrftoken,
            "Accept": "application/json",
            "Authorization": `Token ${localStorage.getItem("token")}`,
        } : {
            "Content-Type": "application/json",
            "X-CSRFToken": csrftoken,
            "Accept": "application/json",
        }

        const response = await fetch(url, {
            method: "PUT",
            headers,
            body: JSON.stringify(data),
            credentials: "include",
        });

        return await response.json();
    } catch (error) {
        setError("Something went wrong: ", error.message);
    } finally {
        setIsLoading(false);
    }
};

// PAYMENTS
export const createPayment = async ({ paymentData, setError, setIsLoading, isAuthenticated }) => {
    try {
        const csrftoken = localStorage.getItem('csrftoken');
        const token = localStorage.getItem('token');
        const url = `${API_URL}api/payment/payment/`;
        const headers = isAuthenticated ? {
            "Content-Type": "application/json",
            "Authorization": `Token ${token}`,
            "X-CSRFToken": csrftoken,
            "Accept": "application/json",
        } : {
            "Content-Type": "application/json",
            "X-CSRFToken": csrftoken,
            "Accept": "application/json",
        };

        const response = await fetch(url, {
            method: 'POST',
            headers,
            body: JSON.stringify(paymentData),
        });

        if (response.ok) {
            return await response.json();
        }
    } catch (error) {
        setError("Have occurred an error while payment processing: ", error.message);
    } finally {
        setIsLoading(false);
    }
};

export const checkPaymentStatus = async ({ orderNumber, setError, setIsLoading }) => {
    try {
        const url = `${API_URL}api/payment/payment/get_status/?order_number=${orderNumber}`;
        const response = await fetch(url, {
            method: "GET",
        });

        if (response.ok) {
            return await response.json();
        }
    } catch (error) {
        setError("Have occurred an error while payment checking: ", error.message);
    } finally {
        setIsLoading(false);
    }
}

