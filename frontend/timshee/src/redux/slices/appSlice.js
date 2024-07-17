import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";

import {
    getCountries as fetchCountries,
    getDynamicSettings as fetchDynamicSettings,
} from "../../main/api/actions";
import {checkAuthStatus} from "./checkAuthSlice";
import {uniqueData} from "../../main/api/stuff";

const initialState = {
    countriesLengthStatus: 'idle',
    countriesLength: 0,
    countries: [],
    continents: [],
    csrftokenStatus: 'idle',
    collections: [],
    collectionsStatus: 'idle',
    categories: [],
    categoriesStatus: 'idle',
    dynamicSettings: undefined,
    dynamicSettingsStatus: 'idle',
};

import { API_URL } from '../../config';

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
);

export const getCategories = createAsyncThunk(
    "app/getCategories",
    async (arg, thunkAPI) => {
        try {
            const response = await fetch(API_URL + "api/store/categories/", {
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
);

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

export const getDynamicSettings = createAsyncThunk(
    "app/getDynamicSettings",
    async ({token}, thunkAPI) => {
        try {
            const result = await fetchDynamicSettings({token});

            if (result) {
                return result;
            } else {
                return thunkAPI.rejectWithValue("Something went wrong...");
            }
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
)

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
                state.countries = action.payload;
                const continents = uniqueData(action.payload.map(c => c.continent), "name");
                if (continents.length > 0) {
                    state.continents = [...continents];
                }
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

            .addCase(getCategories.pending, (state, action) => {
                state.categoriesStatus = 'loading';
            })
            .addCase(getCategories.fulfilled, (state, action) => {
                state.categoriesStatus = 'success';
                state.categories = action.payload;
            })
            .addCase(getCategories.rejected, (state, action) => {
                state.categoriesStatus = 'error';
            })


            .addCase(getDynamicSettings.pending, (state, action) => {
                state.dynamicSettingsStatus = 'loading';
            })
            .addCase(getDynamicSettings.fulfilled, (state, action) => {
                state.dynamicSettingsStatus = 'success';
                state.dynamicSettings = action.payload;
            })
            .addCase(getDynamicSettings.rejected, (state, action) => {
                state.dynamicSettingsStatus = 'error';
            })
    }
});

export const {

} = appSlice.actions;
export default appSlice.reducer;