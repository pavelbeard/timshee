import Cookies from "js-cookie";
import {API_URL, CSRF_TOKEN} from '../../../config'

const csrftoken = Cookies.get('csrftoken');

export const createPayment = async ({isAuthenticated, orderId}) => {
    const url = `${API_URL}/api/payment/create-payment/`;
    const data = {
        "order_id": orderId
    };

    const headers = isAuthenticated ? {
        "Content-Type": "application/json",
        "X-CSRFToken": CSRF_TOKEN,
        "Authorization": `Bearer ${token}`,
        "Accept": "application/json",
    } : {
        "Content-Type": "application/json",
        "X-CSRFToken": CSRF_TOKEN,
        "Accept": "application/json",
    };

    const response = await fetch(url, {
        method: "POST",
        headers,
        body: JSON.stringify(data),
        credentials: "include",
    });

    if (response.ok) {
        const json = await response.json();
        return json["redirect_url"];
    }
}