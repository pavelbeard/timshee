import {api} from "../api";

export async function getWishlist () {
    try {
        const response = await api.get('/api/store/wishlist/get_wishlist_by_user/');
        return await response.data;
    } catch (error) {
        return error;
    }
}

export async function deleteWishlistItem ({wishlistItemId}) {
    try {
        await api.delete(`$/api/store/wishlist/${wishlistItemId}/`);
        return true;
    } catch (error) {
        return error;
    }
}

export async function addToWishlist ({data}) {
    try {
        const response = await api.post(`/api/store/wishlist/`,
            JSON.stringify(data)
        );
        return await response.data;
    } catch (error) {
        return error;
    }
}