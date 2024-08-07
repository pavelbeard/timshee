import {API_URL, CSRF_TOKEN} from '../../config';


// FOR ADDRESSES AND CHECKOUT FORMS
export const getShippingAddresses = async ({ token }) => {
    const url = `${API_URL}/api/order/addresses/get_addresses_by_user/`;
    let headers = {
        "Content-Type": "application/json",
        "Accept": "application/json",
    };

    if (token) {
        headers["Authorization"] = `Bearer ${token}`
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

export const getShippingAddressAsTrue = async({token}) => {
    const url = `${API_URL}/api/order/addresses/get_address_as_primary/`;

    const headers = {
        "Content-Type": "application/json",
        "Accept": "application/json",
    }

    if (token) {
        headers["Authorization"] = `Bearer ${token}`
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

export const createAddress = async ({token, data}) => {
    const url = `${API_URL}/api/order/addresses/`;
    const headers = {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "X-CSRFToken": CSRF_TOKEN,
    }

    if (token) {
        headers["Authorization"] = `Bearer ${token}`
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

export const updateAddress = async ({token, addressId, data}) => {
    const url = `${API_URL}/api/order/addresses/${addressId}/`;
    const headers = {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "X-CSRFToken": CSRF_TOKEN,
    }

    if (token) {
        headers["Authorization"] = `Bearer ${token}`
    }
    const response = await fetch(url, {
        method: "PUT",
        headers,
        body: JSON.stringify(data),
        credentials: "include",
    });

    if (response.ok) {
        return await response.json();
    }
};

export const deleteAddress = async ({token, addressId}) => {
    let headers = {
        "Content-Type": "application/json",
        "X-CSRFToken": CSRF_TOKEN,
        "Accept": "application/json",
    };

    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(API_URL + `/api/order/addresses/${addressId}/`, {
        method: "DELETE",
        headers,
        credentials: "include",
    });

    if (response.status === 204) {
        return true;
    }
};

// JUST GET ONLY ONE REGULAR ADDRESS
export const getAddressDetail = async ({ token, addressId }) => {
    const url = `${API_URL}/api/order/addresses/${addressId}/`;
    const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": `Bearer ${token}`,
            }
        });

    if (response.ok) {
        return await response.json();
    }
};

// WISHLIST
export const addToWishlist = async ({token, data}) => {
    const url = `${API_URL}/api/store/wishlist/`;
    const headers = {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "X-CSRFToken": CSRF_TOKEN,
    };

    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
        method: "POST",
        headers,
        body: JSON.stringify(data),
        credentials: "include",
    })

    if (response.ok) {
        return await response.json();
    } else {
        return false;
    }
};

export const getWishlist = async ({token}) => {
    const url = `${API_URL}/api/store/wishlist/get_wishlist_by_user/`;
    const headers = {
        "Content-Type": "application/json",
        "Accept": "application/json",
    };

    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
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

export const deleteWishlistItem = async ({token, wishlistItemId}) => {
    const url = `${API_URL}/api/store/wishlist/${wishlistItemId}/`;
    const headers = {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "X-CSRFToken": CSRF_TOKEN,
    };

    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
        method: "DELETE",
        headers,
        credentials: "include",
    });

    return response.ok;
};

// GET LOCATION DATA
export const getPhoneCodes = async () => {
    const url = `${API_URL}/api/order/phone-codes/`;
    const response = await fetch(url, {
        credentials: "include",
    });

    if (response.status === 200) {
        return  await response.json();
    }
};

export const getCountries = async () => {
    const url = `${API_URL}/api/order/countries/`;
    const response = await fetch(url, {
        credentials: "include",
    });

    if (response.status === 200) {
        return  await response.json();
    }
};

export const getProvinces = async () => {
    const url = `${API_URL}/api/order/provinces/`;
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
    let url = `${API_URL}/api/order/orders/get_orders_by_user/`;

    let headers = {
        "Content-Type": "application/json",
        "Accept": "application/json",
    };

    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
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
    let url = `${API_URL}/api/order/orders/get_last_order_by_user/`;
    let headers = {
        "Content-Type": "application/json",
        "Accept": "application/json",
    };

    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
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
    let url = `${API_URL}/api/order/orders/${orderId}/`;

    let headers = {
        "Content-Type": "application/json",
        "Accept": "application/json",
    }

    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
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

export const deleteOrder = async ({token, orderId}) => {
    const url = `${API_URL}/api/order/orders/${orderId}/`;

    const headers = {
        "Content-Type": "application/json",
        "X-CSRFToken": CSRF_TOKEN,
        "Accept": "application/json",
        "Authorization": `Bearer ${token}`,
    };

    const response = await fetch(url, {
        method: "DELETE",
        headers,
        credentials: "include",
    });

    return response.ok;
};

export const refundOrder = async ({orderId, data, token, refundWhole=false}) => {
    let url = `${API_URL}/api/payment/payment/${orderId}/`;

    if (refundWhole) {
        url += `refund_whole_order/`;
    } else {
        url += `refund_partial/`;
    }

    const headers = {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "X-CSRFToken": CSRF_TOKEN,
    };

    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
        method: "PUT",
        headers,
        body: JSON.stringify(data),
        credentials: "include",
    });

    if (response.ok) {
        return await response.json();
    } else {
        return false;
    }
}

// CART
export const getCartItems = async () => {
    const url = `${API_URL}/api/cart/cart/`;
    const response = await fetch(url, {
        method: "GET",
        credentials: "include",
    });
    if (response.ok) {
        return await response.json();
    }
};

export const addCartItem = async ({ data, token }) => {
    const url = `${API_URL}/api/cart/cart/`;

    let headers = {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "X-CSRFToken": CSRF_TOKEN,
    };

    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
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

export const clearCart = async ({token, hasOrdered}) => {
    const url = `${API_URL}/api/cart/cart/`;
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

    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
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

export const changeQuantityInCart = async ({itemSrc, increaseStock, token, quantity=1}) => {
    const url = `${API_URL}/api/cart/cart/`;
    let headers = {
        "Content-Type": "application/json",
        "X-CSRFToken": CSRF_TOKEN,
        "Accept": "application/json",
    }

    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
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
};

// STUFF
export const changeEmail = async ({token, data}) => {
    const url = `${API_URL}/api/stuff/profile/change_email/`;
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
        body: JSON.stringify(data),
        credentials: "include",
    });

    if (response.ok) {
        return await response.json();
    } else {
        return false;
    }
};

export const getDynamicSettings = async ({token}) => {
    const url = `${API_URL}/api/stuff/settings/`;

    let headers = {
        "Content-Type": "application/json",
        "Accept": "application/json",
    };

    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
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

export const checkEmail = async ({data}) => {
    const headers = {
        "Content-Type": "application/json",
        "X-CSRFToken": CSRF_TOKEN,
        "Accept": "application/json",
    };

    const url = `${API_URL}/api/stuff/profile/check_email/`;
    const response = await fetch(url, {
        method: "POST",
        headers,
        body: JSON.stringify(data),
        credentials: "include",
    });

    return response.ok;
};

export const changePassword = async ({data}) => {
    const headers = {
        "Content-Type": "application/json",
        "X-CSRFToken": CSRF_TOKEN,
        "Accept": "application/json",
    };

    const url = `${API_URL}/api/stuff/profile/change_password/`;
    const response = await fetch(url, {
        method: "POST",
        headers,
        body: JSON.stringify(data),
        credentials: "include",
    });

    return response.ok;
};

export const checkResetPasswordRequest = async({data}) => {
    const headers = {
        "Content-Type": "application/json",
        "X-CSRFToken": CSRF_TOKEN,
        "Accept": "application/json",
    };

    const url = `${API_URL}/api/stuff/profile/is_reset_password_request_valid/`;
    const response = await fetch(url, {
        method: "POST",
        headers,
        body: JSON.stringify(data),
        credentials: "include",
    });

    return response.ok;
}