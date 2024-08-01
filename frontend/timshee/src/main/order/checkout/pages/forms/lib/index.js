import {API_URL, CSRF_TOKEN} from "../../../../../../config";
import Cookies from "js-cookie";


export async function putShippingMethod({ orderId, data, token }) {
    try {
        const headers = {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "X-CSRFToken": CSRF_TOKEN,
        };

        if (token) {
            headers["Authorization"] = `Bearer ${token}`
        }

        const url = `${API_URL}/api/order/orders/${orderId}/`;
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