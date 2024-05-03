import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";

const initialState = {
    sizesData: [],
    sizes: [],
    colorsData: [],
    colors: [],
    categoriesData: [],
    categories: [],
    filters: [],
}

export const filtersSlice = createSlice({
    name: "filters",
    initialState: initialState,
    reducers: {
        setSizeData: (state, action) => {
            state.sizesData = action.payload;
        },
        updateSizeData: (state, action) => {
            state.sizesData = state.sizesData.map(size =>
                size.id === action.payload.id ? {
                        ...size,
                        checked: action.payload.checked
                } : size
            );

            if (action.payload.checked) {
                state.sizes.push(action.payload.value);
            } else {
                state.sizes = state.sizes.filter(i => i !== action.payload.value);
            }
        },
        resetSizeData: (state, action) => {
            state.sizesData = state.sizesData.map(item => ({...item, checked: false}));
            state.sizes = [];
        },
        setColorsData: (state, action) => {
            state.colorsData = action.payload;
        },
        updateColorsData: (state, action) => {
            state.colorsData = state.colorsData.map(color =>
                color.id === action.payload.id ? {
                    ...color,
                    checked: action.payload.checked
                } : color
            );

            if (action.payload.checked) {
                state.colors.push(action.payload.value);
            } else {
                state.colors = state.colors.filter(i => i !== action.payload.value);
            }
        },
        resetColorsData: (state, action) => {
            state.colorsData = state.colorsData.map(item => ({...item, checked: false}));
            state.colors = [];
        },
        setCategoriesData: (state, action) => {
            state.categoriesData = action.payload;
        },
        updateCategoriesData: (state, action) => {
            state.categoriesData = state.categoriesData.map(category =>
                category.id === action.payload.id ? {
                    ...category,
                    checked: action.payload.checked
                } : category
            );

            if (action.payload.checked) {
                state.categories.push(action.payload.value);
            } else {
                state.categories = state.categories.filter(i => i !== action.payload.value);
            }
        },
        resetCategoriesData: (state, action) => {
            state.categoriesData = state.categoriesData.map(item => ({...item, checked: false}));
            state.categories = [];
        },
        updateFilters: (state, action) => {
            if (action.payload.checked) {
                state.filters.push(action.payload.value);
            } else {
                state.filters = state.filters.filter(i => i !== action.payload.value);
            }
        },
        resetFilters: (state, action) => {
            state.sizesData = state.sizesData.map(item => ({...item, checked: false}));
            state.colorsData = state.colorsData.map(item => ({...item, checked: false}));
            state.categoriesData = state.categoriesData.map(item => ({...item, checked: false}));
            state.sizes = [];
            state.colors = [];
            state.categories = [];
            state.filters = [];
        }
    }
});

export const {
    setSizeData,
    updateSizeData,
    resetSizeData,
    setColorsData,
    updateColorsData,
    resetColorsData,
    setCategoriesData,
    updateCategoriesData,
    resetCategoriesData,
    updateFilters,
    resetFilters,
} = filtersSlice.actions;
export default filtersSlice.reducer;