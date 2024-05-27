import Cookies from "js-cookie";

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

export const deleteOrder = async ({isAuthenticated, orderId}) => {
    const url = `${API_URL}api/order/${isAuthenticated ? "orders" : "anon-orders"}/${orderId}/`;

    const headers = isAuthenticated ? {
        "Content-Type": "application/json",
        "X-CSRFToken": csrftoken,
        "Accept": "application/json",
        "Authorization": `Token ${token}`,
    } : {
        "Content-Type": "application/json",
        "X-CSRFToken": csrftoken,
        "Accept": "application/json",
    };

    const response = await fetch(url, {
        method: "DELETE",
        headers,
        credentials: "include",
    });

    return response.ok;
}

// CART
export const addCartItem = async ({data, }) => {
    let url
    url = `${API_URL}api/cart/cart/`;

    const response = await fetch(url, {
        method: "POST",
        headers: {
            "X-CSRFToken": csrftoken,
            "Content-Type": "application/json",
            "Accept": "application/json",
        },
        body: JSON.stringify(data),
        credentials: "include",
    });

    if (response.ok) {
        const json = await response.json();
        return parseInt(json['quantity']);
    }
};

export const getCartItems = async () => {
    const url = `${API_URL}api/cart/cart/`;
    const response = await fetch(url, {
        method: "GET",
        credentials: "include",
    });
    if (response.ok) {
        return await response.json();
    }
};

export const deleteCartItems = async ({
    isAuthenticated,
    orderId = 0,
    stockId = 0,
    hasOrdered = false,
}) => {
    let body;
    if (stockId === 0 && !hasOrdered) {
        body = {
            "clear": true
        }
    } else if (hasOrdered) {
        body = {
            "clear_by_has_ordered": true,
        }
    } else {
        body = {
            "stock_id": stockId,
            "remove": true
        };
    }
    const url = `${API_URL}api/cart/cart/`;
    const response = await fetch(url, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrftoken,
            "Accept": "application/json",
        },
        body: JSON.stringify(body),
        credentials: "include",
    });

    if (response.ok) {
        if (orderId !== 0) {
            await deleteOrder({isAuthenticated, orderId});
        }
        return true;
    }
};

export const changeQuantityInCart = async ({itemSrc, decreaseStock, isAuthenticated, orderId=0}) => {
    const url = `${API_URL}api/cart/cart/`;
    const headers = {
        "Content-Type": "application/json",
        "X-CSRFToken": csrftoken,
        "Accept": "application/json",
    }
    const body = {
        "stock_id": itemSrc.stock.id,
        "quantity": 1,
        "increase": decreaseStock
    }

    const response = await fetch(url, {
        method: "PUT",
        headers,
        body: JSON.stringify(body),
        credentials: "include",
    });

    if (response.status === 200) {
        // MODIFY THAT CODE
        const json = await response.json();
        return parseInt(json["quantity"]);
    } else if (response.status === 204) {
        console.log(orderId);
        if (orderId !== 0) {
            await deleteOrder({isAuthenticated, orderId})
        }
        return 0;
    }
};
