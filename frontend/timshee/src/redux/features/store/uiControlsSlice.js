import {createSlice} from "@reduxjs/toolkit";

const uiControlsSlice = createSlice({
    name: 'ui',
    initialState: {
        isBurgerMenuOpen: false,
        isFiltersMenuOpen: false,
        isCartMenuOpen: false,
        isChangeEmailFormOpen: false,
        isAddressFormOpen: false,
        isSignInAtCheckoutChecked: false,
    },
    reducers: {
        toggleBurgerMenu: (state, action) => {
            if (action.payload) {
                state.isBurgerMenuOpen = action.payload;
            } else {
                state.isBurgerMenuOpen = !state.isBurgerMenuOpen;
            }
        },
        toggleFiltersMenu: (state, action) => {
            if (action.payload) {
                state.isFiltersMenuOpen = action.payload;
            } else {
                state.isFiltersMenuOpen = !state.isFiltersMenuOpen;
            }
        },
        toggleCartMenu: (state, action) => {
            if (action.payload) {
                state.isCartMenuOpen = action.payload;
            } else {
                state.isCartMenuOpen = !state.isCartMenuOpen;
            }
        },
        toggleChangeEmail: (state, action) => {
            if (action.payload) {
                state.isChangeEmailFormOpen = action.payload;
            } else {
                state.isChangeEmailFormOpen = !state.isChangeEmailFormOpen;
            }
        },
        toggleAddressForm: (state, action) => {
            if (action.payload) {
                state.isAddressFormOpen = action.payload;
            } else {
                state.isAddressFormOpen = !state.isAddressFormOpen;
            }
        },
        toggleSignInAtCheckoutCheckbox: (state, action) => {
            if (action.payload) {
                state.isSignInAtCheckoutChecked = action.payload;
            } else {
                state.isSignInAtCheckoutChecked = !state.isSignInAtCheckoutChecked;
            }
        }
    }
});

export const {
    toggleBurgerMenu,
    toggleFiltersMenu,
    toggleChangeEmail,
    toggleAddressForm,
    toggleCartMenu,
    toggleSignInAtCheckoutCheckbox,
} = uiControlsSlice.actions;
export default uiControlsSlice.reducer;
export const selectIsBurgerMenuOpen = state => state.ui.isBurgerMenuOpen;
export const selectIsChangeEmailFormOpen = state => state.ui.isChangeEmailFormOpen;
export const selectIsAddressFormOpen = state => state.ui.isAddressFormOpen;
export const selectIsFiltersMenuOpen = state => state.ui.isFiltersMenuOpen;
export const selectIsCartMenuOpen = state => state.ui.isCartMenuOpen;
export const selectIsSignInAtCheckoutChecked = state => state.ui.isSignInAtCheckoutChecked;
