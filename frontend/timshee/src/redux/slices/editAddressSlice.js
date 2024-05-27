import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {deleteAddress as extDeleteAddress}  from "./shopSlices/checkout";

const API_URL = process.env.REACT_APP_API_URL;

export const deleteAddress = createAsyncThunk(
    "editAddress/deleteAddress",
    async ({isAuthenticated, addressId}, thunkAPI) => {
        try {
            const response = await extDeleteAddress(addressId);
            return response !== undefined
        } catch (e) {
            thunkAPI.rejectWithValue(e);
        }
    }
);

export const getAddressDetail = createAsyncThunk(
    "editAddress/getAddressDetail",
    async ({addressId}, thunkAPI) => {
        try {
            const url = `${API_URL}api/order/addresses/${addressId}/`;
            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "Authorization": `Token ${localStorage.getItem("token")}`,
                }
            });

            if (response.ok) {
                return await response.json();
            }
        } catch (e) {
            thunkAPI.rejectWithValue(e)
        }
    }
);

export const editAddressSlice = createSlice({
    name: "editAddress",
    initialState: {
        isLoading: undefined,
        hasDeleted: undefined,
        error: undefined,
        address: undefined,
        addressId: undefined,
    },
    reducers: {
        changeAddressId: (state, action) => {
            state.addressId = action.payload;
        },
        resetAddress: (state, action) => {
            state.address = undefined;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(deleteAddress.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(deleteAddress.fulfilled, (state, action) => {
                state.isLoading = false;
                state.hasDeleted = action.payload;
            })
            .addCase(deleteAddress.rejected, (state, action) => {
                state.isLoading = undefined;
                state.error = action.payload;
                state.hasDeleted = undefined;
            })
            .addCase(getAddressDetail.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getAddressDetail.fulfilled, (state, action) => {
                state.isLoading = false;
                state.address = action.payload;
            })
            .addCase(getAddressDetail.rejected, (state, action) => {
                state.isLoading = undefined;
                state.error = action.payload;
                state.address = undefined;
            })
    }
});


export const {
    changeAddressId,
    resetAddress
} = editAddressSlice.actions;
export default editAddressSlice.reducer;