import AuthService from "./authService";
import Cookies from "js-cookie";

const API_URL = process.env.REACT_APP_API_URL;
const csrftoken = Cookies.get("csrftoken");
const token = AuthService.getCurrentUser();

// FOR ADDRESSES AND CHECKOUT FORMS
export const getShippingAddresses = async ({ isAuthenticated }) => {
    const url = `${API_URL}api/order/addresses/get_addresses_by_user/`;
    let headers = {
        "Content-Type": "application/json",
        "Accept": "application/json",
    };

    if (isAuthenticated) {
        headers["Authorization"] = `Bearer ${token?.access}`
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

export const getShippingAddressAsTrue = async({isAuthenticated, token}) => {
    const url = `${API_URL}api/order/addresses/get_address_as_primary/`;

    const headers = {
        "Content-Type": "application/json",
        "Accept": "application/json",
    }

    if (isAuthenticated) {
        headers["Authorization"] = `Bearer ${token?.access}`
    }

    const response = await fetch(url, {
        method: "GET",
        headers,
        credentials: "include",
    });

    if (response.ok) {
        return await response.json();
    } else {
        return false;
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
                "Authorization": `Bearer ${token?.access}`,
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
export const getOrders = async ({token}) => {
    let url = `${API_URL}api/order/orders/get_orders_by_user/`;

    let headers = {
        "Content-Type": "application/json",
        "Accept": "application/json",
    };

    if (token?.access) {
        headers["Authorization"] = `Bearer ${token?.access}`;
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

export const getLastOrder = async ({token}) => {
    let url = `${API_URL}api/order/orders/get_last_order_by_user/`;
    let headers = {
        "Content-Type": "application/json",
        "Accept": "application/json",
    };

    if (token?.access) {
        headers["Authorization"] = `Bearer ${token?.access}`;
    }

    const response = await fetch(url, {
        method: "GET",
        headers,
        credentials: "include",
    });

    if (response.ok) {
        return await response.json();
    } else {
        console.log("reject")
        return false;
    }
};

export const getOrderDetail = async ({orderId, token}) => {
    let url = `${API_URL}api/order/orders/${orderId}/`;

    let headers = {
        "Content-Type": "application/json",
        "Accept": "application/json",
    }

    if (token?.access) {
        headers["Authorization"] = `Bearer ${token?.access}`;
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

export const deleteOrder = async ({isAuthenticated, orderId}) => {
    const url = `${API_URL}api/order/orders/${orderId}/`;

    const headers = {
        "Content-Type": "application/json",
        "X-CSRFToken": csrftoken,
        "Accept": "application/json",
        "Authorization": `Bearer ${token?.access}`,
    };

    const response = await fetch(url, {
        method: "DELETE",
        headers,
        credentials: "include",
    });

    return response.ok;
};

export const refundOrder = async ({orderNumber, data, token}) => {
    const url = `${API_URL}api/payment/refund`;
}

// CART
export const addCartItem = async ({ data, isAuthenticated }) => {
    const url = `${API_URL}api/cart/cart/`;

    let headers = {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "X-CSRFToken": csrftoken,
    };

    if (isAuthenticated) {
        headers["Authorization"] = `Bearer ${token?.access}`;
    }

    const response = await fetch(url, {
        method: "POST",
        headers,
        body: JSON.stringify(data),
        credentials: "include",
    });

    if (response.ok) {
        return await response.json();
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

export const deleteCartItems = async ({isAuthenticated, stockId = 0}) => {
    const body = {
        "stock_id": stockId,
        "remove": true
    };
    let headers = {
        "Content-Type": "application/json",
        "X-CSRFToken": csrftoken,
        "Accept": "application/json",
    }

    if (isAuthenticated) {
        headers["Authorization"] = `Bearer ${token?.access}`;
    }

    const url = `${API_URL}api/cart/cart/`;
    const response = await fetch(url, {
        method: "DELETE",
        headers,
        body: JSON.stringify(body),
        credentials: "include",
    });

    if (response.status === 204) {
        return true;
    }
};

export const clearCart = async ({isAuthenticated, hasOrdered}) => {
    const url = `${API_URL}api/cart/cart/`;
    let headers = {
        "Content-Type": "application/json",
        "X-CSRFToken": csrftoken,
        "Accept": "application/json",
    };
    let body = hasOrdered ? {
        clear_by_has_ordered: true
    } : {
        clear: true
    };

    if (isAuthenticated) {
        headers["Authorization"] = `Bearer ${token?.access}`;
    }
    const response = await fetch(url, {
        method: "DELETE",
        headers,
        body: JSON.stringify(body),
        credentials: "include",
    });

    if (response.status === 204) {
        return true;
    }
}

export const changeQuantityInCart = async ({itemSrc, decreaseStock, isAuthenticated, orderId=0}) => {
    const url = `${API_URL}api/cart/cart/`;
    let headers = {
        "Content-Type": "application/json",
        "X-CSRFToken": csrftoken,
        "Accept": "application/json",
    }

    if (isAuthenticated) {
        headers["Authorization"] = `Bearer ${token?.access}`;
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
    if (response.ok) {
        return await response.json();
    }
};
