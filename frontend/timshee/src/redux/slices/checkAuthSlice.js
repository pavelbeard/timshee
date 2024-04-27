import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {menuLvl1Slice} from "./menuLvl1Slice";

const API_URL = process.env.REACT_APP_API_URL;

const initialState = {
    token: localStorage.getItem("token") || null,
    isValid: false,
    isLoading: false,
    error: null,
}

export const checkAuthStatus = createAsyncThunk(
    "auth/checkAuthSlice",
    async () => {
        const response = await fetch(API_URL + "api/stuff/check-auth/", {
            headers: {
                'Authorization': `Token ${localStorage.getItem("token")}`,
            },
            credentials: "include",
        });

        if (response.ok) {
            const json = await response.json();
            localStorage.setItem("userId", json.user);
            return response.ok;
        }

        throw new Error(response.statusText);
    }
);

const checkAuthSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(checkAuthStatus.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(checkAuthStatus.fulfilled, (state, action) => {
                state.isValid = true;
                state.isLoading = false;
                state.error = null;
            })
            .addCase(checkAuthStatus.rejected, (state, action) => {
                state.isValid = false;
                state.isLoading = false;
                state.error = action.payload;
            });
    }
});

export default checkAuthSlice.reducer;