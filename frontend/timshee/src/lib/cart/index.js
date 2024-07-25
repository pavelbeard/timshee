import {API_URL, CSRF_TOKEN} from "../../config";


export async function getCartItems () {
    const url = `${API_URL}api/cart/cart/`;
    const response = await fetch(url, {
        method: "GET",
        credentials: "include",
    });
    if (response.ok) {
        return await response.json();
    }
}

export async function addCartItem({ data, token }) {
    try {
        const url = `${API_URL}api/cart/cart/`;

        let headers = {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "X-CSRFToken": CSRF_TOKEN,
        };

        if (token?.access) {
            headers["Authorization"] = `Bearer ${token?.access}`;
        }

        const response = await fetch(url, {
            method: "POST",
            headers,
            body: JSON.stringify(data),
            credentials: "include",
        });

        if (!response.ok) {
            throw new Error('Could not add cart item');
        }
        return await response.json();
    } catch (error) {
        return error;
    }
}

export async function clearCart ({token, hasOrdered}){
    try {
        const url = `${API_URL}api/cart/cart/`;
        let headers = {
            "Content-Type": "application/json",
            "X-CSRFToken": CSRF_TOKEN,
            "Accept": "application/json",
        };
        let body = hasOrdered ? {
            clear_by_has_ordered: true
        } : {
            clear: true
        };

        if (token?.access) {
            headers["Authorization"] = `Bearer ${token?.access}`;
        }
        const response = await fetch(url, {
            method: "DELETE",
            headers,
            body: JSON.stringify(body),
            credentials: "include",
        });

        if (!response.ok) {
            throw new Error('Could not clear the cart');
        }
        return true;
    } catch (error) {
        return error;
    }
}

export async function changeQuantityInCart ({itemSrc, increaseStock, token, quantity=1}) {
    const url = `${API_URL}api/cart/cart/`;
    let headers = {
        "Content-Type": "application/json",
        "X-CSRFToken": CSRF_TOKEN,
        "Accept": "application/json",
    }

    if (token?.access) {
        headers["Authorization"] = `Bearer ${token?.access}`;
    }

    const body = {
        "stock_id": itemSrc.stock.id,
        "quantity": quantity,
        "increase": increaseStock
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
}