import {API_URL, CSRF_TOKEN} from "../../config";

export async function createAddress({token, data}) {
    try {
        const headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'X-CSRFToken': CSRF_TOKEN,
        };

        if (token?.access) {
            headers["Authorization"] = `Bearer ${token.access}`;
        }

        const url = `${API_URL}api/order/addresses/`;
        const response = await fetch(url, {
            method: "POST",
            headers,
            body: JSON.stringify(data),
            credentials: "include",
        });

        return await response.json();
    } catch (error) {
        return error;
    }
}

export async function getAddressAsPrimary({token}) {
    try {
        const headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token.access}`
        };
        const url = `${API_URL}api/order/addresses/get_address_as_primary/`;
        const response = await fetch(url, {
            method: 'GET',
            headers,
            credentials: "include",
        });

        return await response.json();
    } catch (error) {
        return error;
    }
}

export async function getAddresses({token}) {
    try {
        const headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token.access}`
        };
        const url = `${API_URL}api/order/addresses/get_addresses_by_user/`;
        const response = await fetch(url, {
            method: "GET",
            headers,
            credentials: "include",
        });

        return await response.json();
    } catch (error) {
        return error;
    }
}

export async function editAddress({token, data, addressId}) {
    try {
        const headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'X-CSRFToken': CSRF_TOKEN,
        };

        if (token?.access) {
            headers['Authorization'] = `Bearer ${token.access}`;
        }

        const url = `${API_URL}api/order/addresses/${addressId}/`;
        const response = await fetch(url, {
            method: 'PUT',
            headers,
            body: JSON.stringify(data),
            credentials: "include",
        });

        return await response.json();
    } catch (error) {
        return error;
    }
}

export async function deleteAddress({token, addressId}) {
    try {
        const headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token.access}`,
            'X-CSRFToken': CSRF_TOKEN,
        };
        const url = `${API_URL}api/order/addresses/${addressId}/`;
        const response = await fetch(url, {
            method: "DELETE",
            headers,
            credentials: "include",
        })
    } catch (error) {
        return error
    }
}

