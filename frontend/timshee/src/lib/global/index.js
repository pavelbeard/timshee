import {API_URL, CSRF_TOKEN} from "../../config";

export async function getPhoneCodes () {
    try {
        const url = `${API_URL}api/order/phone-codes/`;
        const response = await fetch(url, {
            credentials: "include",
        });

        return await response.json();
    } catch (error) {
        return error;
    }
}

export async function getCountries() {
    try {
        const url = `${API_URL}api/order/countries/`;
        const response = await fetch(url, {
            credentials: "include",
        });

        if (!response.ok) {
            throw new Error(response.statusText);
        }

        return await response.json();
    } catch (error) {
        return error;
    }
}

export async function getProvinces() {
    try {
        const url = `${API_URL}api/order/provinces/`;
        const response = await fetch(url, {
            credentials: "include",
        });

        if (!response.ok) {
            throw new Error(response.statusText);
        }

        return await response.json();
    } catch (error) {
        return error;
    }
}

export async function getOrders ({token}) {
    try {
        const url = `${API_URL}api/order/orders/get_orders_by_user/`;
        const headers = {
            "Content-Type": "application/json",
            "Accept": "application/json",
        };

        if (token?.access) {
            headers["Authorization"] = `Bearer ${token?.access}`;
        }

        const response = await fetch(url, {
            method: "GET",
            headers,
            credentials: "include",
        });

        if (!response.ok) {
            throw new Error(response.statusText);
        }

        return await response.json();
    } catch (error) {
        return error;
    }
}

export async function updateOrder ({ orderId, data, token }) {
    try {
        const url = `${API_URL}api/order/orders/${orderId}/`;
        const headers = {
            "Content-Type": "application/json",
            "X-CSRFToken": CSRF_TOKEN,
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

        if (!response.ok) {
            throw new Error(response.statusText);
        }

        return await response.json();
    } catch (error) {
        return error;
    }
}