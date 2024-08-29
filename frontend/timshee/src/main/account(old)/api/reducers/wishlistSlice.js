import {createSlice, current} from "@reduxjs/toolkit";
import {addToWishlist, deleteWishlistItem, getWishlist} from "./asyncThunks";

const initialState = {
    wishlist: [],
    wishlistStatus: 'idle',
    getWishlistStatus: 'idle',
    deleteWishlistItemStatus: 'idle',
    isItemInWishlist: 0,
};

const wishlistSlice = createSlice({
    name: "wishlist",
    initialState,
    reducers: {
        checkItemInWishList: (state, action) => {
            const {itemId, size: sizeId, color: colorId} = action.payload;
            const item = [...current(state).wishlist].find(item =>
                item.stock.item?.id === parseInt(itemId) &&
                item.stock.size?.id === sizeId &&
                item.stock.color?.id === colorId
            );
            state.isItemInWishlist = item?.id ? item.id : false;
        }
    },
    extraReducers: builder => {
        builder
            .addCase(addToWishlist.pending, (state, action) => {
                state.wishlistStatus  = 'loading';
            })
            .addCase(addToWishlist.fulfilled, (state, action) => {
                state.wishlistStatus = 'success';
                state.wishlist.push(action.payload);
                state.isItemInWishlist = action.payload.id;
            })
            .addCase(addToWishlist.rejected, (state, action) => {
                state.wishlistStatus = 'error';
            })

            .addCase(getWishlist.pending, (state, action) => {
                state.getWishlistStatus = 'loading';
            })
            .addCase(getWishlist.fulfilled, (state, action) => {
                state.getWishlistStatus = 'success';
                state.wishlist = action.payload;
            })
            .addCase(getWishlist.rejected, (state, action) => {
                state.getWishlistStatus = 'error';
            })

            .addCase(deleteWishlistItem.pending, (state, action) => {
                state.deleteWishlistItemStatus = 'loading';
            })
            .addCase(deleteWishlistItem.fulfilled, (state, action) => {
                state.deleteWishlistItemStatus = 'success';
                state.wishlist = [...current(state).wishlist].filter((wishlist) => wishlist.id !== action.payload);
                state.isItemInWishlist = 0;
            })
            .addCase(deleteWishlistItem.rejected, (state, action) => {
                state.deleteWishlistItemStatus = 'error';
            })
    }
});

export const {
    checkItemInWishList,
} = wishlistSlice.actions;
export default wishlistSlice.reducer;