import Cookies from "js-cookie";

const API_URL = process.env.REACT_APP_API_URL;
const csrftoken = Cookies.get("csrftoken");

export const createAddress = async ({data, isAuthenticated}) => {
    let headers;
    if (isAuthenticated) {
        headers = {
            "Content-Type": "application/json",
            "X-CSRFToken": csrftoken,
            "Authorization": `Token ${localStorage.getItem("token")}`,
        };
    } else {
        headers = {
            "X-CSRFToken": csrftoken,
            "Content-Type": "application/json",
        }
        data['is_last'] = true;
    }
    const url = isAuthenticated
        ? `${API_URL}api/order/addresses/`
        : `${API_URL}api/order/anon-addresses/`;

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

export const updateAddress = async ({shippingAddress, shippingAddressId, isAuthenticated}) => {
    const url = isAuthenticated
        ? `${API_URL}api/order/addresses/${shippingAddressId}/`
        : `${API_URL}api/order/anon-addresses/${shippingAddressId}/`;

    let headers;
    if (isAuthenticated) {
        headers = {
            "Content-Type": "application/json",
            "X-CSRFToken": csrftoken,
            "Accept": "application/json",
            "Authorization": `Token ${localStorage.getItem("token")}`,
        };
    } else {
        headers = {
            "Content-Type": "application/json",
            "X-CSRFToken": csrftoken,
            "Accept": "application/json",
        };
    }

    const response = await fetch(url, {
        method: "PUT",
        headers,
        body: JSON.stringify(shippingAddress),
        credentials: "include",
    });

    if (response.ok) {
        return await response.json();
    } else {
        return response
    }
};

export const deleteAddress = async (addressId) => {
    const response = await fetch(API_URL + `api/order/addresses/${addressId}/`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrftoken,
            "Authorization": `Token ${localStorage.getItem("token")}`,
        },
        credentials: "include",
    });

    if (response.ok) {
        return await response.json();
    }
};

export const updateOrder = async (
    {orderId, totalPrice, newItems, isAuthenticated, addData, status = "pending_for_pay"}
) => {
    const body = {
        "status": status,
    };

    if (totalPrice !== undefined && newItems !== undefined) {
        const copyItems = [...newItems];
        const filteredItems = copyItems.map(((item) => {
            const {colors, sizes, ...newItem} = item.stock.item;
            const stock = item.stock;
            return {...item, stock: {...stock, item: newItem}};
        }));

        body["ordered_items"] = {
            "data": filteredItems,
            "total_price": totalPrice,
        }
    }

    if (addData) {
        if ('shippingAddressId' in addData) {
        body["shipping_address"] = addData.shippingAddressId;
        }
        if ('shippingMethodId' in addData) {
            body["shipping_method"] = addData.shippingMethodId;
        }
    }

    const url = isAuthenticated
        ? `${API_URL}api/order/orders/${orderId}/`
        : `${API_URL}api/order/anon-orders/${orderId}/`;

    const headers = isAuthenticated ? {
        "Content-Type": "application/json",
        "X-CSRFToken": csrftoken,
        "Accept": "application/json",
        "Authorization": `Token ${localStorage.getItem("token")}`,
    } : {
        "Content-Type": "application/json",
        "X-CSRFToken": csrftoken,
        "Accept": "application/json",
    }

    const response = await fetch(url, {
        method: "PUT",
        headers,
        body: JSON.stringify(body),
        credentials: "include",
    });

    return await response.json();
};

export const createOrder = async (totalPrice, items, isAuthenticated) => {
    const copyItems = [...items];
    const filteredItems = copyItems.map((item) => {
        const {colors, sizes, ...newItem} = item.stock.item;
        const stock = item.stock;
        return {...item, stock: {...stock, item: newItem}};
    });

    const body = {
        "ordered_items": {
            "data": filteredItems,
            "total_price": totalPrice,
        },
        "status": "pending_for_pay",
    };

    const url = [
        API_URL,
        isAuthenticated
            ? "api/order/orders/"
            : `api/order/anon-orders/`,
    ].join("")
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrftoken,
            "Accept": "application/json",
            "Authorization": `Token ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(body),
        credentials: "include",
    });
    return await response.json();
}


