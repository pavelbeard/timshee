export const storeTags = {
    GET_WISHLIST_ITEM: "GET_WISHLIST_ITEM",
    GET_WISHLIST_BY_USER: "GET_WISHLIST_BY_USER",
    ADD_WISHLIST_ITEM: "ADD_WISHLIST_ITEM",
    DELETE_WISHLIST_ITEM: "DELETE_WISHLIST_ITEM",
};

export const cartTags = {
    ADD_ITEM_TO_CART: "ADD_ITEM_TO_CART",
    DELETE_ITEM_FROM_CART: "DELETE_ITEM_FROM_CART",
    REMOVE_ALL_CART: "REMOVE_ALL_CART",
    CHANGE_QUANTITY_OF_ITEM: "CHANGE_QUANTITY_OF_ITEM",
    GET_CART_ITEMS: "GET_CART_ITEMS",
};

export const orderTags = {
    UPDATE_ORDER: "UPDATE_ORDER",
    EXP_UPDATE_ORDER: { type: 'ORDER', id: 'ORDER_OBJ' },
    GET_ORDER: "GET_ORDER"
};

export const authTags = {
    SIGN_IN: "SIGN_IN",
    SIGN_OUT: "SIGN_OUT",
    CHANGE_EMAIL: "CHANGE_EMAIL",
    CONFIRM_EMAIL: "CONFIRM_EMAIL"
};

export const stuffTags = {
    CHANGE_LANGUAGE: "CHANGE_LANGUAGE",
};

export const paymentTags = {
    HAS_SUCCEEDED: "HAS_SUCCEEDED",
    HAS_FAILED: "HAS_FAILED"
};

export const accountTags = {
    ADDRESSES_BY_USER: 'ADDRESSES_BY_USER',
    EXP_ADDRESSES_BY_USER: { type: 'ADDRESSES', id: 'USER' }
};