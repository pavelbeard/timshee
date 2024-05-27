const API_URL = process.env.REACT_APP_API_URL;
const csrftoken = localStorage.getItem("csrftoken");
const token = localStorage.getItem("token");

// FOR ADDRESSES AND CHECKOUT FORMS
export const getShippingAddresses = async ({ isAuthenticated }) => {
    let url, headers;
    if (isAuthenticated) {
        url = `${API_URL}api/order/addresses/get_addresses_by_user/`;
        headers = {
            "Content-Type": "application/json",
            "Authorization": `Token ${localStorage.getItem("token")}`,
            "Accept": "application/json",
        };
    } else {
        url = `${API_URL}api/order/anon-addresses/get_addresses_by_session/`;
        headers = {
            "Content-Type": "application/json",
            "Accept": "application/json",
        };
    }

    const response = await fetch(url, {
        method: "GET",
        headers,
        credentials: "include",
    });

    if (response.ok) {
        return await response.json();
    }
};

export const getShippingAddressAsTrue = async({isAuthenticated}) => {
    const url = isAuthenticated
        ? `${API_URL}api/order/addresses/get_address_as_primary/`
        : `${API_URL}api/order/anon-addresses/get_address_is_last/`

    const headers = isAuthenticated ? {
        "Content-Type": "application/json",
        "Authorization": `Token ${localStorage.getItem("token")}`,
        "Accept": "application/json",
    } : {
        "Content-Type": "application/json",
        "Accept": "application/json",
    }

    const response = await fetch(url, {
        method: "GET",
        headers,
        credentials: "include",
    });

    if (response.ok) {
        const result = await response.json();
        return result;
    }
};

// JUST GET ONLY ONE REGULAR ADDRESS
export const getAddressDetail = async ({ addressId }) => {
    const url = `${API_URL}api/order/addresses/${addressId}/`;
    const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": `Token ${localStorage.getItem("token")}`,
            }
        });

    if (response.ok) {
        return await response.json();
    }
};

// GET LOCATION DATA
export const getPhoneCodes = async () => {
    const url = `${API_URL}api/order/phone-codes/`;
    const response = await fetch(url, {
        credentials: "include",
    });

    if (response.status === 200) {
        return  await response.json();
    }
};

export const getCountries = async () => {
    const url = `${API_URL}api/order/countries/`;
    const response = await fetch(url, {
        credentials: "include",
    });

    if (response.status === 200) {
        return  await response.json();
    }
};

export const getProvinces = async () => {
    const url = `${API_URL}api/order/provinces/`;
    const response = await fetch(url, {
        credentials: "include",
    });

    if (response.status === 200) {
        return  await response.json();
    }
};

// GET, SET, UPDATE AND DELETE ORDERS

//FOR AUTHENTICATED USERS
//"get_orders_by_user", "get_last_order_by_user"
export const getOrders = async () => {
    let url = `${API_URL}api/order/orders/get_orders_by_user/`;

    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Token ${token}`,
            "Accept": "application/json",
        },
        credentials: "include",
    });

    if (response.ok) {
        return await response.json();
    }
};

export const getLastOrder = async () => {
    let url = `${API_URL}api/order/orders/get_last_order_by_user/`;

    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Token ${token}`,
            "Accept": "application/json",
        },
        credentials: "include",
    });

    if (response.ok) {
        return await response.json();
    }
};

export const getOrderDetail = async ({orderId}) => {
    let url = `${API_URL}api/order/orders/${orderId}/`;

    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Token ${token}`,
            "Accept": "application/json",
        },
        credentials: "include",
    });

    if (response.ok) {
        return await response.json();
    }
};