import { API_URL } from "../../../../../../config";
import Cookies from "js-cookie";

const csrftoken = Cookies.get("csrftoken");

export async function putAddress({ data, shippingAddressId, token }) {
    try {
        const headers = {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "X-CSRFToken": csrftoken,
        };

        if (token?.access) {
            headers["Authorization"] = `Bearer ${token.access}`;
        }

        let url= `${API_URL}api/order/addresses/`;

        if (shippingAddressId !== 0 && shippingAddressId !== undefined) {
            url += `${shippingAddressId}/`;
        }

        let response;

        if (shippingAddressId === 0 || shippingAddressId === undefined) {
            response = await fetch(url, {
                method: "POST",
                headers,
                body: JSON.stringify(data),
                credentials: "include",
            });
        } else {
            response = await fetch(url, {
                method: "PUT",
                headers,
                body: JSON.stringify(data),
                credentials: "include",
            });
        }

        if (response.ok) {
            return true
        } else {
            throw new Error("Could not put address...");
        }
    } catch (error) {
        return error;
    }
}

export async function putShippingMethod({ orderId, data, token }) {
    try {
        const headers = {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "X-CSRFToken": csrftoken,
        };

        if (token?.access) {
            headers["Authorization"] = `Bearer ${token.access}`;
        }

        const url = `${API_URL}api/order/orders/${orderId}/`;
        const response = await fetch(url, {
            method: "PUT",
            body: JSON.stringify(data),
            headers
        });

        if (response.ok) {
            return true;
        } else {
            throw new Error("Something went wrong...");
        }
    } catch (error) {
        return error;
    }
}
