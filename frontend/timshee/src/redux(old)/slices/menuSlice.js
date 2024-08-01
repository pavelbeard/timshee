import { createSlice } from "@reduxjs/toolkit";

export const menuSlice = createSlice({
    name: "menu",
    initialState: {
        isActive: false,
        isMenuLvl1Active: false,
        isMenuLvl2Active: false,
        isChangeEmailClicked: false,
        shopIsTouched: false,
        collectionsIsTouched: false,
        accountBarIsTouched: false,
        isAddressCreateFormOpened: false,
        isAddressEditFormOpened: false,
        isCartMenuOpen: false,
    },
    reducers: {
        toggleMenuLvl2: (state) => {
            state.isMenuLvl2Active = !state.isMenuLvl2Active;
        },
        toggleCreateAddressForm: (state) => {
            state.isAddressCreateFormOpened = !state.isAddressCreateFormOpened;
        },
        toggleAddressEditForm: (state) => {
            state.isAddressEditFormOpened = !state.isAddressEditFormOpened;
        },
        toggleChangeEmail: (state) => {
            state.isChangeEmailClicked = !state.isChangeEmailClicked;
        },

        toggleCart: (state, action) => {
            if (action.payload === false) {
                state.isCartMenuOpen = false;
            } else {
                state.isCartMenuOpen = !state.isCartMenuOpen;
            }
        },
        closeCart: (state) => {
            state.isCartMenuOpen = false;
        }
    }
})

export const {
    toggleCreateAddressForm,
    toggleAddressEditForm,
    toggleChangeEmail,
    toggleCart,
    closeCart,
} = menuSlice.actions;
export default menuSlice.reducer;