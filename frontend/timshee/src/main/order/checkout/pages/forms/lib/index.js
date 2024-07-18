import { API_URL } from "../../../../../../config";
import Cookies from "js-cookie";

const csrftoken = Cookies.get("csrftoken");

export async function putShippingMethod({ orderId, data, token }) {
    try {
        const headers = {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "X-CSRFToken": csrftoken,
        };

        if (token?.access) {
            headers["Authorization"] = `Bearer ${token.access}`
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