import {createSlice, current} from "@reduxjs/toolkit";
import {getCategories, getColors, getItems, getSizes} from "../asyncThunks";

const initialState = {
    filters: [],
    sizes: [],
    sizesStatus: 'idle',
    colors: [],
    colorsStatus: 'idle',
    categories: [],
    categoriesStatus: 'idle',
    items: [],
    itemsStatus: 'idle',
    pagesCount: 0,
    totalItemsCount: 0,
    sortOrder: [
        {value: "", name: "---"},
        {value: "price", name: "ascending"},
        {value: "-price", name: "descending"},
    ],
    genders: [
        {gender: "F", value: "women"},
        {gender: "M", value: "men"},
        {gender: "U", value: "unisex"}
    ],
    error: undefined,
};

const shopSlice = createSlice({
    name: "shop",
    initialState,
    reducers: {
        checkSizes: (state, action) => {
            const filteredSize = [...current(state).sizes].find(size =>
                size.id === action.payload
            );
            const changedSize = {...filteredSize, checked: !filteredSize.checked}

            if (changedSize.checked) {
                state.filters.push(changedSize.value);
            } else {
                const index = state.filters.findIndex(i => i === changedSize.value);
                state.filters.splice(index, 1);
            }

            const index = state.sizes.findIndex(i => i.id === changedSize.id);
            state.sizes[index] = changedSize;
        },
        uncheckSizes: (state, action) => {
            const sizesCopy = [...current(state).sizes];
            state.sizes = sizesCopy.map(i => {return {...i, checked: false}});
            const valuesToRemove = [...current(state).sizes].map(i => i.value);
            state.filters = state.filters.filter(i => !valuesToRemove.includes(i));
        },
        checkColors: (state, action) => {
            const filteredColor = [...current(state).colors].find(color =>
                color.id === action.payload
            );
            const changedColor = {...filteredColor, checked: !filteredColor.checked};

            if (changedColor.checked) {
                state.filters.push(changedColor.value);
            } else {
                const index = state.filters.findIndex(i => i === changedColor.value);
                state.filters.splice(index, 1);
            }

            const index = state.colors.findIndex(i => i.id === changedColor.id);
            state.colors[index] = changedColor;
        },
        uncheckColors: (state, action) => {
            const colorsCopy = [...current(state).colors];
            state.colors = colorsCopy.map(i => {return {...i, checked: false}});
            const valuesToRemove = [...current(state).colors].map(i => i.value);
            state.filters = state.filters.filter(i => !valuesToRemove.includes(i));
        },
        checkCategories: (state, action) => {
            const filteredCategory = [...current(state).categories].find(category =>
                category.id === action.payload
            );
            const changedCategory = {...filteredCategory, checked: !filteredCategory.checked};

            if (changedCategory.checked) {
                state.filters.push(changedCategory.value);
            } else {
                const index = state.filters.findIndex(i => i === changedCategory.value);
                state.filters.splice(index, 1);
            }

            const index = state.categories.findIndex(i => i.id === changedCategory.id);
            state.categories[index] = changedCategory;
        },
        uncheckCategories: (state, action) => {
            const categoriesCopy = [...current(state).categories];
            state.categories = categoriesCopy.map(i => {return {...i, checked: false}});
            const valuesToRemove = [...current(state).categories].map(i => i.value);
            state.filters = state.filters.filter(i => !valuesToRemove.includes(i));
        },
        updateOrderBy: (state, action) => {
            const name = [...current(state).sortOrder].find(i => i.value === action.payload).name;
            const index = state.filters.findIndex(i => i === "descending" || i === "ascending");

            if (index === -1 && action.payload !== "") {
                state.filters.push(name);
            } else if (index !== -1 && action.payload !== "") {
                state.filters[index] = name;
            } else if (action.payload === "") {
                state.filters.splice(index, 1);
            }
        },
        resetFilters: (state, action) => {
            state.sizes = [...current(state).sizes].map(item => {return {...item, checked: false}});
            state.colors = [...current(state).colors].map(item => {return {...item, checked: false}});
            state.categories = [...current(state).categories].map(item => {return {...item, checked: false}});
            state.filters = [];
        }
    },
    extraReducers: builder => {
        builder
            .addCase(getSizes.pending, (state, action) => {
                state.sizesStatus = 'loading';
            })
            .addCase(getSizes.fulfilled, (state, action) => {
                state.sizesStatus = 'success';
                state.sizes = action.payload;
            })
            .addCase(getSizes.rejected, (state, action) => {
                state.sizesStatus = 'error';
                state.error = action.payload;
            })

            .addCase(getColors.pending, (state, action) => {
                state.colorsStatus = 'loading';
            })
            .addCase(getColors.fulfilled, (state, action) => {
                state.colorsStatus = 'success';
                state.colors = action.payload;
            })
            .addCase(getColors.rejected, (state, action) => {
                state.colorsStatus = 'error';
                state.error = action.payload;
            })

            .addCase(getCategories.pending, (state, action) => {
                state.itemsStatus = 'loading';
            })
            .addCase(getCategories.fulfilled, (state, action) => {
                state.categoriesStatus = 'success';
                state.categories = action.payload;
            })
            .addCase(getCategories.rejected, (state, action) => {
                state.categoriesStatus = 'error';
                state.error = action.payload;
            })

            .addCase(getItems.pending, (state, action) => {
                state.itemsStatus = 'loading';
            })
            .addCase(getItems.fulfilled, (state, action) => {
                state.itemsStatus = 'success';
                state.items = action.payload.items;
                state.pagesCount = action.payload.pagesCount;
                state.totalItemsCount = action.payload.totalItemsCount;
            })
            .addCase(getItems.rejected, (state, action) => {
                state.itemsStatus = 'error';
                state.error = action.payload;
            })
    }
})

export const {
    checkSizes,
    uncheckSizes,
    checkColors,
    uncheckColors,
    checkCategories,
    uncheckCategories,
    updateOrderBy,
    resetFilters,
} = shopSlice.actions;
export default shopSlice.reducer;