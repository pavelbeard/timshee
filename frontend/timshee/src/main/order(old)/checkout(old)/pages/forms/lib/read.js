import {API_URL} from "../../../../../../config";

export async function getAddresses({ token }) {
    try {
        const headers = {
            'content-type': 'application/json',
            'accept': 'application/json',
        };

        if (token?.access) {
            headers["Authorization"] = `Bearer ${token.access}`;
        }

        const url = `${API_URL}api/order/addresses/get_addresses_by_user/`;
        const response = await fetch(url, {
            method: 'GET',
            headers,
            credentials: "include",
        });

        if (response.ok) {
            return await response.json();
        } else {
            throw new Error('Something went wrong...');
        }
    } catch (error) {
        return error
    }
}