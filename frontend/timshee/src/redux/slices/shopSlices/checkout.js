import {API_URL, CSRF_TOKEN} from '../../../config';

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

    const url = `${API_URL}/api/order/orders/${orderId}/`;
    let headers = {
        "Content-Type": "application/json",
        "X-CSRFToken": CSRF_TOKEN,
        "Accept": "application/json",
    };

    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
        method: "PUT",
        headers,
        body: JSON.stringify(body),
        credentials: "include",
    });

    return await response.json();
};
