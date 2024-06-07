import { createSlice } from "@reduxjs/toolkit";

export const menuSlice = createSlice({
    name: "menu",
    initialState: {
        isActive: false,
        isMenuLvl1Active: false,
        isMenuLvl2Active: false,
        shopIsTouched: false,
        collectionsIsTouched: false,
        accountBarIsTouched: false,
        isAddressEditFormOpened: false,
        isCartClicked: false,
    },
    reducers: {
        toggleMenu: (state) => {
            state.isActive = !state.isActive;
        },
        toggleMenuLvl1: (state) => {
            state.isMenuLvl1Active = !state.isMenuLvl1Active;
        },
        toggleMenuLvl2: (state) => {
            state.isMenuLvl2Active = !state.isMenuLvl2Active;
        },
        toggleShopIsTouched: (state) => {
            state.shopIsTouched = !state.shopIsTouched;
        },
        toggleCollectionsIsTouched: (state) => {
            state.collectionsIsTouched = !state.collectionsIsTouched;
        },
        toggleAccountBarIsTouched: (state, action) => {
            state.accountBarIsTouched = !state.accountBarIsTouched;
        },
        toggleAddressEditForm: (state) => {
            state.isAddressEditFormOpened = !state.isAddressEditFormOpened;
        },
        toggleCart: (state, action) => {
            if (action.payload === false) {
                state.isCartClicked = false;
            } else {
                state.isCartClicked = !state.isCartClicked;
            }
        },
        closeCart: (state) => {
            state.isCartClicked = false;
        }
    }
})

export const {
    toggleMenu,
    toggleMenuLvl1,
    toggleMenuLvl2,
    toggleShopIsTouched,
    toggleCollectionsIsTouched,
    toggleAccountBarIsTouched,
    toggleAddressEditForm,
    toggleCart,
    closeCart,
} = menuSlice.actions;
export default menuSlice.reducer;