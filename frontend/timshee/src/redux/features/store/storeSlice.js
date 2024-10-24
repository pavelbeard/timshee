import { createSlice, current } from "@reduxjs/toolkit";
import { apiSlice } from "../../services/app/api/apiSlice";

const mergeCheckboxData = (arr1, arr2, k, v, lookupForMerge) => {
  const map = new Map([...arr1].map((item) => [item[k], item[v]]));
  return [...arr2].map((item) => ({
    ...item,
    total: map.get(item[lookupForMerge]) || 0,
  }));
};

const modifyFilters = (arr1, arr2, checked, accessKey) => {
  const copy1 = arr1.slice();
  const modArr = arr2
    .slice()
    .filter((i) => i.checked === checked)
    .map((i) => i[accessKey]);
  const set1 = new Set(copy1);
  const set2 = new Set(modArr);
  if (checked) {
    // Union
    return [...new Set([...set1, ...set2])];
  } else {
    // Difference
    return [...new Set([...set1].filter((x) => !set2.has(x)))];
  }
};

const storeSlice = createSlice({
  name: "store",
  initialState: {
    openBlock: null,
    sizesWithSelection: [],
    colorsWithSelection: [],
    stocks: [],
    sizes: [],
    colors: [],
    types: [],
    collections: [],
    categories: [],
    itemsObject: null,
    isLoading: true,
    isError: true,
    error: null,
    isSuccess: true,
    selectedLength: {
      sizes: 0,
      colors: 0,
      types: 0,
      collections: 0,
      categories: 0,
      orderBy: "",
    },
    orderBy: [],
    genders: {
      women: "women",
      men: "men",
      unisex: "unisex",
      misc: "misc",
    },
    filters: [],
    wishlist: [],
  },
  reducers: {
    setItemsObject: (state, action) => {
      const { items, pagesCount, totalItemsCount } = action.payload;
      const {
        totalSizes,
        totalColors,
        totalTypes,
        totalCollections,
        totalCategories,
      } = action.payload;
      state.itemsObject = { items, pagesCount, totalItemsCount };
      state.sizes = mergeCheckboxData(
        totalSizes,
        current(state.sizes),
        "size__value",
        "total_sizes",
        "value",
      );
      state.colors = mergeCheckboxData(
        totalColors,
        current(state.colors),
        "color__name",
        "total_colors",
        "name",
      );
      state.types = mergeCheckboxData(
        totalTypes,
        current(state.types),
        "item__type__name",
        "total_types",
        "name",
      );
      state.collections = mergeCheckboxData(
        totalCollections,
        current(state.collections),
        "item__collection__name",
        "total_collections",
        "name",
      );
      state.categories = mergeCheckboxData(
        totalCategories,
        current(state.categories),
        "item__type__category__name",
        "total_categories",
        "name",
      );
    },
    setOpenBlock(state, action) {
      state.openBlock = action.payload;
    },
    closeFilterBlock(state) {
      state.openBlock = null;
    },
    setSizes(state, action) {
      state.sizes = action.payload;
    },
    setColors(state, action) {
      state.colors = action.payload;
    },
    setTypes(state, action) {
      state.types = action.payload;
    },
    setCollections(state, action) {
      state.collections = action.payload;
    },
    setCategories(state, action) {
      state.categories = action.payload;
    },
    setTotalItemsCount(state, action) {
      state.totalItemsCount = action.payload;
    },
    setLoading(state, action) {
      state.isLoading = action.payload;
    },
    setIsError(state, action) {
      state.isError = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
    setIsSuccess(state, action) {
      state.isSuccess = action.payload;
    },
    toggleCheckboxes(state, action) {
      const { category, id, key, checked } = action.payload;
      const update = (arr) =>
        arr.map((item) => (item[key] === id ? { ...item, checked } : item));
      switch (category) {
        case "sizes":
          const updatedSizes = update(current(state.sizes));
          state.sizes = updatedSizes;
          state.filters = modifyFilters(
            current(state.filters),
            updatedSizes,
            checked,
            "value",
          );
          state.selectedLength.sizes = state.sizes.filter(
            (s) => s.checked,
          ).length;
          break;
        case "colors":
          const updatedColors = update(current(state.colors));
          state.colors = updatedColors;
          state.filters = modifyFilters(
            current(state.filters),
            updatedColors,
            checked,
            "name",
          );
          state.selectedLength.colors = state.colors.filter(
            (i) => i.checked,
          ).length;
          break;
        case "types":
          const updatedTypes = update(current(state.types));
          state.types = updatedTypes;
          state.filters = modifyFilters(
            current(state.filters),
            updatedTypes,
            checked,
            "name",
          );
          state.selectedLength.types = state.types.filter(
            (i) => i.checked,
          ).length;
          break;
        case "collections":
          const updatedCollections = update(current(state.collections));
          state.collections = updatedCollections;
          state.filters = modifyFilters(
            current(state.filters),
            updatedCollections,
            checked,
            "name",
          );
          state.selectedLength.collections = state.collections.filter(
            (i) => i.checked,
          ).length;
          break;
        case "categories":
          const updatedCategories = update(current(state.categories));
          state.categories = updatedCategories;
          state.filters = modifyFilters(
            current(state.filters),
            updatedCategories,
            checked,
            "name",
          );
          state.selectedLength.categories = state.categories.filter(
            (i) => i.checked,
          ).length;
          break;
        default:
          break;
      }
    },
    initOrderBy(state, action) {
      state.orderBy = action.payload;
    },
    setOrderBy(state, action) {
      const updatedOrderBy = state.orderBy.map((o) =>
        o.value === action.payload
          ? { ...o, selected: true }
          : { ...o, selected: false },
      );
      state.orderBy = updatedOrderBy;
      const foundValue = updatedOrderBy.find(
        (o) => o.value === action.payload,
      )?.name;
      // if there is a value from orderBy in arr
      const isThere = updatedOrderBy.find((o) =>
        state.filters.find((f) => f === o.name),
      )?.name;
      // if yes and not equal '---' - replace
      if (state.filters.includes(isThere) && foundValue !== "---") {
        state.filters.splice(state.filters.indexOf(isThere), 1, foundValue);
        // if not and action.payload doesn't equal ''
      } else if (action.payload !== "") {
        state.filters.push(foundValue);
        // other cases - delete from filters
      } else {
        state.filters.splice(foundValue, 1);
      }
      state.selectedLength.orderBy = foundValue;
    },
    resetSizes(state) {
      state.sizes = state.sizes.map((s) => ({ ...s, checked: false }));
      state.filters = state.filters.filter((s) =>
        state.sizes.includes((size) => size.name === s),
      );
      state.selectedLength.sizes = 0;
    },
    resetColors(state) {
      state.colors = state.colors.map((c) => ({ ...c, checked: false }));
      state.filters = state.filters.filter((c) =>
        state.colors.includes((color) => color.name === c),
      );
      state.selectedLength.colors = 0;
    },
    resetTypes(state) {
      state.types = state.types.map((t) => ({ ...t, checked: false }));
      state.filters = state.filters.filter((t) =>
        state.types.includes((type) => type.name === t),
      );
      state.selectedLength.types = 0;
    },
    resetCollections(state) {
      state.collections = state.collections.map((c) => ({
        ...c,
        checked: false,
      }));
      state.filters = state.filters.filter((c) =>
        state.collections.includes((collection) => collection.name === c),
      );
      state.selectedLength.collections = 0;
    },
    resetCategories(state) {
      state.categories = state.categories.map((c) => ({
        ...c,
        checked: false,
      }));
      state.filters = state.filters.filter((c) =>
        state.categories.includes((category) => category.name === c),
      );
      state.selectedLength.categories = 0;
    },
    resetOrderBy(state) {
      state.orderBy.map((s) =>
        s.value === "" ? { ...s, selected: true } : { ...s, selected: false },
      );
      state.filters = state.filters.filter((o) =>
        state.orderBy.includes((orderBy) => orderBy.name === o),
      );
      state.selectedLength.orderBy = "";
    },
    uncheckAll(state) {
      state.sizes = state.sizes.map((s) => ({ ...s, checked: false }));
      state.colors = state.colors.map((c) => ({ ...c, checked: false }));
      state.types = state.types.map((t) => ({ ...t, checked: false }));
      state.collections = state.collections.map((c) => ({
        ...c,
        checked: false,
      }));
      state.categories = state.categories.map((c) => ({
        ...c,
        checked: false,
      }));
      state.orderBy = [...state.orderBy].map((s) =>
        s.value === "" ? { ...s, selected: true } : { ...s, selected: false },
      );
      state.selectedLength = storeSlice.getInitialState().selectedLength;
      state.filters = [];
    },
    setSizesWithSelection(state, action) {
      state.sizesWithSelection = action.payload;
    },
    setColorsWithSelection(state, action) {
      state.colorsWithSelection = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        apiSlice.endpoints.getStoreData.matchFulfilled,
        (state, action) => {
          state.isLoading = false;
          state.sizes = action?.payload?.sizes || [];
          state.colors = action?.payload?.colors || [];
          state.types = action?.payload?.types || [];
          state.collections = action?.payload?.collections || [];
          state.categories = action?.payload?.categories || [];
          state.isSuccess = true;
        },
      )
      // setting up item detail selections
      .addMatcher(
        apiSlice.endpoints.getItem.matchFulfilled,
        (state, action) => {
          state.sizesWithSelection = action?.payload?.sizes?.map((s, i) =>
            i === 0 ? { ...s, selected: true } : { ...s, selected: false },
          );
          state.colorsWithSelection = action?.payload?.colors?.map((c, i) =>
            i === 0 ? { ...c, selected: true } : { ...c, selected: false },
          );
          state.stocks = action?.payload?.stocks?.map((s) => ({
            size: s?.sizes__value,
            color: s?.colors__name,
            sizeId: s?.stock__size_id,
            colorId: s?.stock__color_id,
            inStock: s?.in_stock,
          }));
        },
      )
      .addMatcher(
        apiSlice.endpoints.getWishlistByUser.matchFulfilled,
        (state, action) => {
          state.wishlist = action?.payload || [];
        },
      );
  },
});
export default storeSlice.reducer;
export const {
  initOrderBy,
  setItemsObject,
  setOpenBlock,
  setSizes,
  setColors,
  setTypes,
  setCollections,
  setCategories,
  setOrderBy,
  setLoading,
  setIsError,
  setError,
  setIsSuccess,
  toggleCheckboxes,
  resetSizes,
  resetColors,
  resetTypes,
  resetCollections,
  resetCategories,
  resetOrderBy,
  uncheckAll,
  setSizesWithSelection,
  setColorsWithSelection,
} = storeSlice.actions;
export const selectGenders = (state) => state.store.genders;
export const selectOrderBy = (state) => state.store.orderBy;
export const selectWomen = (state) => state.store.genders[0];
export const selectMen = (state) => state.store.genders[1];
export const selectUnisex = (state) => state.store.genders[2];
export const selectItemsObject = (state) => state.store.itemsObject;
export const selectTotalItemsCount = (state) =>
  state.store?.itemsObject?.totalItemsCount || 0;
export const selectItemsAreLoading = (state) => state.store.isLoading;
export const selectIsSuccess = (state) => state.store.isSuccess;
export const selectIsError = (state) => state.store.isError;
export const selectErrorObj = (state) => state.store.error;
export const selectSizes = (state) => state.store.sizes;
export const selectColors = (state) => state.store.colors;
export const selectTypes = (state) => state.store.types;
export const selectCollections = (state) => state.store.collections;
export const selectCategories = (state) => state.store.categories;
export const selectFilters = (state) => state.store.filters;
export const selectSizesWithSelection = (state) =>
  state.store.sizesWithSelection;
export const selectColorsWithSelection = (state) =>
  state.store.colorsWithSelection;
export const selectStocks = (state) => state.store.stocks;
export const selectWishlist = (state) => state.store.wishlist;
export const selectWishlistLength = (state) =>
  state.store.wishlist?.length || 0;
