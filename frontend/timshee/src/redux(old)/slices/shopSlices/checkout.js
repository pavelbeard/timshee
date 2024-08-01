import Cookies from "js-cookie";
import AuthService from "../../../main/api(old)/authService";
import { API_URL } from '../../../config';

const csrftoken = Cookies.get("csrftoken");
const token = AuthService.getAccessToken();

export const createAddress = async ({data, token}) => {
    let headers = {
        "Content-Type": "application/json",
        "X-CSRFToken": csrftoken,
        "Authorization": `Bearer ${token?.access}`,
    };

    if (token?.access) {
        headers["Authorization"] = `Bearer ${token?.access}`;
    }

    const url = `${API_URL}api/order/addresses/`;

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

export const updateAddress = async ({shippingAddress, shippingAddressId, token}) => {
    const url = `${API_URL}api/order/addresses/${shippingAddressId}/`;
    let headers = {
        "Content-Type": "application/json",
        "X-CSRFToken": csrftoken,
        "Accept": "application/json",
    };

    if (token?.access) {
        headers["Authorization"] = `Bearer ${token?.access}`;
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

export const updateOrder = async (
    {orderId, totalPrice, newItems, token, addData, status = "pending_for_pay"}
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
        const orderItemIds = copyItems.map((item) => {
            const {colors, sizes, order_item_id} = item.stock
            return order_item_id;
        });

        body["ordered_items"] = {
            "data": filteredItems,
            "total_price": totalPrice,
            "order_item": orderItemIds,
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

    const url = `${API_URL}api/order/orders/${orderId}/`;
    let headers = {
        "Content-Type": "application/json",
        "X-CSRFToken": csrftoken,
        "Accept": "application/json",
    };

    if (token?.access) {
        headers["Authorization"] = `Bearer ${token?.access}`;
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

    const url = "api/order/orders/";
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrftoken,
            "Accept": "application/json",
            "Authorization": `Bearer ${token?.access}`,
        },
        body: JSON.stringify(body),
        credentials: "include",
    });
    return await response.json();
}


