import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {deleteAddress as extDeleteAddress}  from "./shopSlices/checkout";
import AuthService from "../../main/api/authService";

const API_URL = process.env.REACT_APP_API_URL;
const token = AuthService.getCurrentUser();

export const deleteAddress = createAsyncThunk(
    "editAddress/deleteAddress",
    async ({isAuthenticated, addressId}, thunkAPI) => {
        try {
            const result = await extDeleteAddress({isAuthenticated, addressId});
            if (result) {
                return result;
            } else {
                return thunkAPI.rejectWithValue("Something went wrong...");
            }
        } catch (error) {
            return  thunkAPI.rejectWithValue(error.message);
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
                    "Authorization": `Bearer ${token?.access}`,
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
        deleteAddressStatus: 'idle',
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
                state.deleteAddressStatus = 'loading';
            })
            .addCase(deleteAddress.fulfilled, (state, action) => {
                state.deleteAddressStatus = 'success';
                state.hasDeleted = action.payload;
            })
            .addCase(deleteAddress.rejected, (state, action) => {
                state.deleteAddressStatus = 'error';
                state.error = action.payload;
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