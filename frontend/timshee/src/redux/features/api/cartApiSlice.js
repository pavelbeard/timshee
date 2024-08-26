import {apiSlice} from "../../services/app/api/apiSlice";
import {cartTags} from "./tags";

const tags = cartTags;

const _apiSliceWithTags = apiSlice.enhanceEndpoints({
    addTagTypes: [
        tags.ADD_ITEM_TO_CART,
        tags.DELETE_ITEM_FROM_CART,
        tags.REMOVE_ALL_CART,
        tags.CHANGE_QUANTITY_OF_ITEM,
        tags.GET_CART_ITEMS,
    ],
})

export const cartApiSlice = _apiSliceWithTags.injectEndpoints({
    endpoints: builder => ({
        getCartItems: builder.query({
            query: () => ({
                url: '/cart/cart-items/get_items/',
                method: 'GET'
            }),
            providesTags: [
                tags.ADD_ITEM_TO_CART,
                tags.DELETE_ITEM_FROM_CART,
                tags.REMOVE_ALL_CART,
                tags.CHANGE_QUANTITY_OF_ITEM,
            ],
        }),
        addCartItem: builder.mutation({
            query: (data) => ({
                url: '/cart/cart-items/add_item/',
                method: 'POST',
                body: {...data}
            }),
            invalidatesTags: [tags.ADD_ITEM_TO_CART],
        }),
        changeQuantity: builder.mutation({
            query: (data) => ({
                url: '/cart/cart-items/change_quantity/',
                method: 'PUT',
                body: {...data}
            }),
            invalidatesTags: [tags.CHANGE_QUANTITY_OF_ITEM]
        }),
        removeCartItem: builder.mutation({
            query: (id) => ({
                url: '/cart/cart-items/remove/',
                method: 'DELETE',
                body: {...id}
            }),
            invalidatesTags: [tags.DELETE_ITEM_FROM_CART]
        }),
        clearCart: builder.mutation({
            query: (data) => ({
                url: '/cart/cart-items/clear_cart/',
                method: 'DELETE',
                body: {...data}
            }),
            providesTags: [tags.REMOVE_ALL_CART],
            invalidatesTags: [tags.REMOVE_ALL_CART]
        }),
        addItemsToOrder: builder.query({
            query: () => ({
                url: '/cart/cart-items/add_to_order/',
                method: 'POST'
            })
        })
    })
});

export const {
    useLazyGetCartItemsQuery,
    useAddCartItemMutation,
    useChangeQuantityMutation,
    useRemoveCartItemMutation,
    useClearCartMutation,
    useLazyAddItemsToOrderQuery,
} = cartApiSlice;