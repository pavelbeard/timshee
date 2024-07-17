import {setError, setIsLoading} from "./reducers/checkoutSlice";
import AuthService from "../../api/authService";
import Cookies from "js-cookie";

import { API_URL } from '../../../config';
const csrftoken = Cookies.get("csrftoken");
const token = AuthService.getCurrentUser();

// ADDRESSES
export const createOrUpdateAddress = async ({shippingAddress, shippingAddressId, token}) => {
    let url= `${API_URL}api/order/addresses/`;

    if (shippingAddressId !== 0 && shippingAddressId !== undefined) {
        url += `${shippingAddressId}/`;
    }

    let headers = {
        "Content-Type": "application/json",
        "X-CSRFToken": csrftoken,
        "Accept": "application/json",
    };

    if (token?.access) {
        headers["Authorization"] = `Bearer ${token?.access}`;
    }

    let response;

    if (shippingAddressId === 0 || shippingAddressId === undefined) {
        response = await fetch(url, {
            method: "POST",
            headers,
            body: JSON.stringify(shippingAddress),
            credentials: "include",
        });
    } else {
        response = await fetch(url, {
            method: "PUT",
            headers,
            body: JSON.stringify(shippingAddress),
            credentials: "include",
        });
    }

    if (response.ok) {
        return await response.json();
    } else {
        return false;
    }
};

// ORDERS
export const getOrder = async ({ orderId, isAuthenticated, dispatch }) => {
    try {
        const url = `${API_URL}api/order/orders/${orderId}/`;
        const headers = {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token?.access}`,
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

export const updateOrder = async ({ orderId, data, token, setError, setIsLoading }) => {
    try {
        const url = `${API_URL}api/order/orders/${orderId}/`;
        const headers = {
            "Content-Type": "application/json",
            "X-CSRFToken": csrftoken,
            "Accept": "application/json",
        };

        if (token?.access) {
            headers["Authorization"] = `Bearer ${token?.access}`;
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
export const createPayment = async ({ paymentData, setError, setIsLoading, token }) => {
    try {
        const url = `${API_URL}api/payment/payment/`;

        const headers = {
            "Content-Type": "application/json",
            "X-CSRFToken": csrftoken,
            "Accept": "application/json",
        }

        if (token?.access) {
            headers["Authorization"] = `Bearer ${token?.access}`;
        }

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

export const checkPaymentStatus = async ({ orderNumber, setError, setIsLoading, token }) => {
    try {
        const headers = {
            "Content-Type": "application/json",
            "Accept": "application/json",
        };

        if (token?.access) {
            headers["Authorization"] = `Bearer ${token?.access}`;
        }

        const url = `${API_URL}api/payment/payment/${orderNumber}/get_status/`;
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

export const updatePaymentInfo = async ({ storeOrderNumber, data, setError, setIsLoading }) => {
    try {
        const url = `${API_URL}api/payment/payment/${storeOrderNumber}/`;
        const headers = {
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

        if (response.ok) {
            return await response.json();
        }
    } catch (error) {
        setError("Have occurred an error while payment checking: ", error.message);
    } finally {
        setIsLoading(false);
    }
};

