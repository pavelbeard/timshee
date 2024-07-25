import {API_URL} from "../../config";

export async function getShippingMethods() {
    try {
        let url = `${API_URL}api/order/shipping-methods/`;
        const response = await fetch(url, {
            method: "GET",
            credentials: "include",
        });

        if (!response.ok) {
            throw new Error(response.statusText);
        }

        const shippingMethods = await response.json();
        return shippingMethods.map((method) => {
            return {...method, checked: false};
        });
    } catch (error) {
        return error;
    }
}