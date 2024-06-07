import {createAsyncThunk} from "@reduxjs/toolkit";

const API_URL = process.env.REACT_APP_API_URL;

export const getItems = createAsyncThunk(
    "shop/getItems",
    async ({filters, currentPage=1}, thunkAPI) => {

        try {
            const filterSizes = filters?.sizes.length > 0
                ? `&sizes__value__in=${filters?.sizes.join(',')}`
                : "";
            const filterColors = filters?.colors.length > 0
                ? `&colors__name__in=${filters?.colors.join(',')}`
                : "";
            const filterCategories = filters?.categories.length > 0
                ? `&type__category__name__in=${filters?.categories.join(',')}`
                : "";
            const filterOrderBy = filters?.orderBy
                ? `&o=${filters.orderBy}`
                : "";
            const filterGender = filters?.gender
                ? `&gender=${filters.gender}`
                : "";
            const filterCollection = filters?.collection
                ? `&collection__link=${filters.collection}`
                : "";
            const encodedURI = encodeURI(API_URL
                + `api/store/items/?${currentPage === 1 ? "" : `page=${currentPage}`}`
                + filterSizes
                + filterColors
                + filterCategories
                + filterOrderBy
                + filterGender
                + filterCollection
            );

            const response = await fetch(encodedURI, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
                credentials: "include",
            });

            if (response.ok) {
                const json = await response.json();
                return {
                    pagesCount: Math.ceil(json.count / 9),
                    items: json.results,
                    totalItemsCount: json.count,
                }
            } else {
                return thunkAPI.rejectWithValue("Something went wrong...")
            }
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

export const getSizes = createAsyncThunk(
    "shop/getSizes",
    async (arg, thunkAPI) => {
        try {
            const response = await fetch(API_URL + "api/store/sizes/");

            if (response.ok) {
                const json = await response.json();
                const newSizes = [];
                json.forEach((item) => {
                    newSizes.push({id: item.id, value: item.value, checked: false});
                });
                return newSizes;
            } else {
                return thunkAPI.rejectWithValue("Something went wrong...")
            }
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

export const getColors = createAsyncThunk(
    "shop/getColors",
    async (args, thunkAPI) => {
        try {
            const url = `${API_URL}/api/store/colors/`;
            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
                credentials: "include",
            });
            if (response.ok) {
                const json = await response.json();

                const newColors = [];
                json.forEach((item) => {
                    newColors.push({id: item.id, value: item.name, hex: item.hex, checked: false});
                })

                return newColors;
            } else {
                return thunkAPI.rejectWithValue("Something went wrong...")
            }
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

export const getCategories = createAsyncThunk(
    "shop/getCategories",
    async (arg, thunkAPI) => {
        try {
            const url = `${API_URL}api/store/categories/`;
            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
                credentials: "include",
            });
            if (response.ok) {
                const json = await response.json();

                const newCategories = [];
                json.forEach((item) => {
                    newCategories.push({id: item.id, value: item.name, checked: false});
                });

                return newCategories;
            } else {
                return thunkAPI.rejectWithValue("Something went wrong...")
            }
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);