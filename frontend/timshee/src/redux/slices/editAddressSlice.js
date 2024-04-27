import { createSlice } from "@reduxjs/toolkit";

export const editAddressSlice = createSlice({
    name: "editAddress",
    initialState: {
        first_name: "",
        last_name: "",
        address1: "",
        address2: "",
        postal_code: "",
        city: "",
        country: "",
        phone_number: "",
        email: "",
        address_id: "",
        as_primary: false,
    },
    reducers: {
        changeAddress: (state, action) => {
            state.first_name = action.payload.first_name;
            state.last_name = action.payload.last_name;
            state.address1 = action.payload.address1;
            state.address2 = action.payload.address2;
            state.postal_code = action.payload.postal_code;
            state.city = action.payload.city;
            state.country = action.payload.country;
            state.phone_number = action.payload.phone_number;
            state.email = action.payload.email;
            state.address_id = action.payload.address_id;
            state.as_primary = action.payload.as_primary;
        }
    }
})

export const {changeAddress} = editAddressSlice.actions;
export default editAddressSlice.reducer;