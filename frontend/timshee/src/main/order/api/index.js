import {setError, setIsLoading} from "./reducers/checkoutSlice";
import AuthService from "../../api/authService";
import Cookies from "js-cookie";

import {API_URL, CSRF_TOKEN} from '../../../config';

// ADDRESSES
export const createOrUpdateAddress = async ({shippingAddress, shippingAddressId, token}) => {
    let url= `${API_URL}/api/order/addresses/`;

    if (shippingAddressId !== 0 && shippingAddressId !== undefined) {
        url += `${shippingAddressId}/`;
    }

    let headers = {
        "Content-Type": "application/json",
        "X-CSRFToken": CSRF_TOKEN,
        "Accept": "application/json",
    };

    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
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
export const getOrder = async ({ orderId, token, dispatch }) => {
    try {
        const url = `${API_URL}/api/order/orders/${orderId}/`;
        const headers = {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
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
        const url = `${API_URL}/api/order/orders/${orderId}/`;
        const headers = {
            "Content-Type": "application/json",
            "X-CSRFToken": CSRF_TOKEN,
            "Accept": "application/json",
        };

        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
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
        const url = `${API_URL}/api/payment/payment/`;

        const headers = {
            "Content-Type": "application/json",
            "X-CSRFToken": CSRF_TOKEN,
            "Accept": "application/json",
        }

        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
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

export const checkPaymentStatus = async ({ orderId, setError, setIsLoading, token }) => {
    try {
        const headers = {
            "Content-Type": "application/json",
            "Accept": "application/json",
        };

        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }

        const url = `${API_URL}/api/payment/payment/${orderId}/get_status/`;
        const response = await fetch(url, {
            method: "GET",
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
}

export const updatePaymentInfo = async ({ storeOrderId, data, setError, setIsLoading }) => {
    try {
        const url = `${API_URL}/api/payment/payment/${storeOrderId}/`;
        const headers = {
            "Content-Type": "application/json",
            "X-CSRFToken": CSRF_TOKEN,
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

