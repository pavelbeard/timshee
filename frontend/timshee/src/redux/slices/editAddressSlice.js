import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import AuthService from "../../main/api/authService";
import { API_URL } from '../../config';

const token = AuthService.getCurrentUser();



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
        hasDeleted: 0,
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