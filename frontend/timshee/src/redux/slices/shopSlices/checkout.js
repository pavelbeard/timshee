import Cookies from "js-cookie";

const API_URL = process.env.REACT_APP_API_URL;
const csrftoken = Cookies.get("csrftoken");

export const checkPending = async (isAuthenticated) => {
    let headers;
    if (isAuthenticated) {
        headers = {
            "Content-Type": "application/json",
            "Authorization": `Token ${localStorage.getItem("token")}`,
        };
    } else {
        headers = {
            "Content-Type": "application/json",
        }
    }

    const sessionKey = localStorage.getItem("sessionKey") || "";
    const response = await fetch(
        `${API_URL}api/order/check-pending-for-payment/?sessionKey=${sessionKey}`, {
        method: "GET",
        headers,
    });

    if (response.ok) {
        const json = await response.json();
        return json["pending"];
    }
};

export const createOrder = async (items, isAuthenticated) => {
    const copyItems = [...items];
    const filteredItems = copyItems.map((item) => {
        const {colors, sizes, ...newItem} = item.stock.item;
        const stock = item.stock;
        return {...item, stock: {...stock, item: newItem}};
    });

    let body;
    if (isAuthenticated) {
        body = JSON.stringify({
            "ordered_items": filteredItems,
            "status": "pending_for_pay",
            "user": localStorage.getItem("userId"),
        });

    } else {
        body = JSON.stringify({
            "ordered_items": filteredItems,
            "status": "pending_for_pay",
        });
    }

    const sessionKey = localStorage.getItem("sessionKey") || "";
    const url = [
        API_URL,
        isAuthenticated
            ? "api/order/orders/"
            : `api/order/anon-orders/?sessionKey=${sessionKey}`,
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
