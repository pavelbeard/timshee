import Cookies from "js-cookie";

const API_URL = process.env.REACT_APP_API_URL;
const csrftoken = Cookies.get('csrftoken');

export const createPayment = async ({orderId}) => {
    const url = `${API_URL}api/payment/create-payment/`;
    const data = {
        "order_id": orderId
    };

    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrftoken,
            "Accept": "application/json",
        },
        body: JSON.stringify(data),
        credentials: "include",
    });

    if (response.ok) {
        const json = await response.json();
        return json["redirect_url"];
    }
}