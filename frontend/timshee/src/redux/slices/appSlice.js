import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";

import {
    getCountries as fetchCountries,
} from "../../main/api/asyncFetchers";
import {checkAuthStatus} from "./checkAuthSlice";
import error from "../../main/Error";

const initialState = {
    countriesLengthStatus: 'idle',
    countriesLength: 0,
    csrftokenStatus: 'idle',
    collections: [],
    collectionsStatus: 'idle',
};

const API_URL = process.env.REACT_APP_API_URL;

export const getCsrfToken = createAsyncThunk(
    "app/getCsrfToken",
    async (arg, thunkAPI) => {
        try {
            await fetch(API_URL + "api/stuff/get-csrf-token/", {
                credentials: "include",
            });
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

export const getCollectionLinks = createAsyncThunk(
    "app/getCollectionLinks",
    async (arg, thunkAPI) => {
        try {
            const response = await fetch(API_URL + "api/store/collections/", {
                credentials: "include",
            });

            if (response.status === 200) {
                return await response.json();
            } else {
                return thunkAPI.rejectWithValue("Something went wrong...");
            }
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
)

export const getCountries = createAsyncThunk(
    "app/getCountries",
    async (arg, thunkAPI) => {
        try {
            const result = await fetchCountries();
            if (result) {
                return result;
            } else {
                return  thunkAPI.rejectWithValue("Something went wrong...");
            }
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

const appSlice = createSlice({
    name: "app",
    initialState,
    reducers: {

    },
    extraReducers: builder => {
        builder
            .addCase(checkAuthStatus.pending, (state, action) => {
                state.countriesLengthStatus = 'loading';
            })
            .addCase(getCountries.fulfilled, (state, action) => {
                state.countriesLengthStatus = 'success';
                state.countriesLength = action.payload.length;
            })
            .addCase(getCountries.rejected, (state, action) => {
                state.countriesLengthStatus = 'error';
                state.error = action.payload;
            })

            .addCase(getCsrfToken.pending, (state, action) => {
                state.csrftokenStatus = 'loading';
            })
            .addCase(getCsrfToken.fulfilled, (state, action) => {
                state.csrftokenStatus = 'success';
            })
            .addCase(getCsrfToken.rejected, (state, action) => {
                state.csrftokenStatus = 'error';
                state.error = action.payload;
            })

            .addCase(getCollectionLinks.pending, (state, action) => {
                state.collectionsStatus = 'loading';
            })
            .addCase(getCollectionLinks.fulfilled, (state, action) => {
                state.collectionsStatus = 'success';
                state.collections = action.payload;
            })
            .addCase(getCollectionLinks.rejected, (state, action) => {
                state.collectionsStatus = 'error';
                state.error = action.payload;
            })
    }
});

export const {

} = appSlice.actions;
export default appSlice.reducer;