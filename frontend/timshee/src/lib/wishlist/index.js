import { API_URL, CSRF_TOKEN } from "../../config";

export async function getWishlist ({token}) {
    try {
        const url = `${API_URL}api/store/wishlist/get_wishlist_by_user/`;
        const headers = {
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

        return await response.json();
    } catch (error) {
        return error;
    }
}

export async function deleteWishlistItem ({token, wishlistItemId}) {
    try {
        const url = `${API_URL}api/store/wishlist/${wishlistItemId}/`;
        const headers = {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "X-CSRFToken": CSRF_TOKEN,
        };

        if (token?.access) {
            headers["Authorization"] = `Bearer ${token?.access}`;
        }

        await fetch(url, {
            method: "DELETE",
            headers,
            credentials: "include",
        });
    } catch (error) {
        return error;
    }
}

export async function addToWishlist ({token, data}) {
    try {
        const url = `${API_URL}api/store/wishlist/`;
        const headers = {
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
        })

        return await response.json();
    } catch (error) {
        return error;
    }
}