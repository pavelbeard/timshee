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
    }
};

export const updateOrder = async (
    {orderId, totalPrice, newItems, isAuthenticated, addData, status = "pending_for_pay"}
) => {
    let body;
    if (isAuthenticated) {
        body = {
            "status": status,
            "user": localStorage.getItem("userId"),
        };
    } else {
        body = {
            "status": status,
        };
    }

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

    const response = await fetch(url, {
        method: "PUT",
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
};

export const createOrder = async (totalPrice, items, isAuthenticated) => {
    const copyItems = [...items];
    const filteredItems = copyItems.map((item) => {
        const {colors, sizes, ...newItem} = item.stock.item;
        const stock = item.stock;
        return {...item, stock: {...stock, item: newItem}};
    });

    let body;
    if (isAuthenticated) {
        body = JSON.stringify({
            "ordered_items": {
                "data": filteredItems,
                "total_price": totalPrice,
            },
            "status": "pending_for_pay",
            "user": localStorage.getItem("userId"),
        });

    } else {
        body = JSON.stringify({
            "ordered_items": {
                "data": filteredItems,
                "total_price": totalPrice,
            },
            "status": "pending_for_pay",
        });
    }

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
        body,
        credentials: "include",
    });
    return await response.json();
}

export const deleteOrder = async (isAuthenticated) => {
    const orderId = JSON.parse(localStorage.getItem("order"))?.id;

    if (orderId === undefined) {
        return false;
    }

    const url = `${API_URL}api/order/${
        isAuthenticated ? "orders" : "anon-orders"
    }/${orderId}/`;

    const response = await fetch(url, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrftoken,
            "Accept": "application/json",
            "Authorization": `Token ${localStorage.getItem("token")}`,
        },
        credentials: "include",
    });

    return response.status === 204;
}
