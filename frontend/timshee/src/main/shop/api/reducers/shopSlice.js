import {createSlice, current} from "@reduxjs/toolkit";
import {getCategories, getColors, getItems, getSizes, getTypes} from "../asyncThunks";

const initialState = {
    filters: [],
    sizes: [],
    sizesStatus: 'idle',
    colors: [],
    colorsStatus: 'idle',
    categories: [],
    categoriesStatus: 'idle',
    types: [],
    typesStatus: 'idle',
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
        checkTypes: (state, action) => {
            const filteredType = [...current(state).types].find(type =>
                type.id === action.payload
            );
            const changedType = {...filteredType, checked: !filteredType.checked};

            if (changedType.checked) {
                state.filters.push(changedType.value);
            } else {
                const index = state.filters.findIndex(i => i === changedType.value);
                state.filters.splice(index, 1);
            }

            const index = state.types.findIndex(i => i.id === changedType.id);
            state.types[index] = changedType;
        },
        uncheckTypes: (state, action) => {
            const typesCopy = [...current(state).types];
            state.types = typesCopy.map(i => {return {...i, checked: false}});
            const valuesToRemove = [...current(state).types].map(i => i.value);
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
            state.types = [...current(state).types].map(item => {return {...item, checked: false}});
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
                state.categoriesStatus = 'loading';
            })
            .addCase(getCategories.fulfilled, (state, action) => {
                state.categoriesStatus = 'success';
                state.categories = action.payload;
            })
            .addCase(getCategories.rejected, (state, action) => {
                state.categoriesStatus = 'error';
                state.error = action.payload;
            })

            .addCase(getTypes.pending, (state, action) => {
                state.typesStatus = 'loading';
            })
            .addCase(getTypes.fulfilled, (state, action) => {
                state.typesStatus = 'success';
                state.types = action.payload;
            })
            .addCase(getTypes.rejected, (state, action) => {
                state.typesStatus = 'error';
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

                state.sizes = [...current(state).sizes].map(i => {
                    const totalSizes = action.payload.totalSizes.find(
                        g => g.stock__size__value === i.value
                    )?.total_sizes || 0;
                    return {...i, total: totalSizes};
                });
                state.colors = [...current(state).colors].map(i => {
                    const totalColors = action.payload.totalColors.find(
                        g => g.stock__color__name === i.value
                    )?.total_colors || 0;
                    return {...i, total: totalColors};
                });
                state.types = [...current(state).types].map(i => {
                    const totalTypes = action.payload.totalTypes.find(
                        g => g.type__name === i.value
                    )?.total_types || 0;
                    return {...i, total: totalTypes};
                });
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
    checkTypes,
    uncheckTypes,
    updateOrderBy,
    resetFilters,
} = shopSlice.actions;
export default shopSlice.reducer;