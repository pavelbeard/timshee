import { create } from "zustand";
import {
    getOrders, updateOrder,
} from "./lib/global";
import AuthService from "./main/api(old)/authService";
import { changeEmail, getEmail } from "./lib/stuff";
import { getShippingMethods } from "./lib/orders";
import { addCartItem, changeQuantityInCart, clearCart, getCartItems } from "./lib/cart";
import { getWishlist, deleteWishlistItem, addToWishlist } from "./lib/wishlist";
import { getCollectionLinks, getCategories, getCollections, getColors, getItems, getSizes, getTypes} from "./lib/shop";
import { sendEmail } from "./emails";
import {useLocationSlice, useStuffSlice} from "./slices";

export const useLocationStore = create((...a) => ({
    ...useLocationSlice(...a),
}))

export const useStuffStore = create((...a) => ({
    ...useStuffSlice(...a),
}))

export const useGlobalStore = create((...a) => ({
    ...useLocationSlice(...a),
    ...useStuffSlice(...a),
}));

export const useShopStore = create((set, get) => ({
    error: null,
    collectionLinks: [],
    collections: [],
    categories: [],
    sizes: [],
    colors: [],
    types: [],
    itemsObject: null,

    filters: [],
    getCollectionLinks: async () => {
        const collectionLinks = await getCollectionLinks();
        console.log('store.js', collectionLinks)
        if (!(collectionLinks instanceof Error)) {
            set(() => ({ collectionLinks }));
        } else {
            set(() => ({ error: collectionLinks.message }));
        }
    },
    setCollectionLinks: (payload) => set(() => ({ collectionLinks: payload })),
    getCollections: async () => {
        const collections = await getCollections();
        if (!(collections instanceof Error)) {
            set(() =>({ collections }));
        } else {
            set(() =>({ error: collections.message }));
        }
    },
    setCollections: (payload) => set(() => ({ collections: payload })),
    getCategories: async () => {
        const categories = await getCategories();
        
        if (!(categories instanceof Error)) {
            set(() => ({ categories }));
        } else {
            set(() => ({ error: categories.message }));
        }
    },
    setCategories: (payload) => set(() => ({ categories: payload })),
    getSizes: async () => {
        const sizes = await getSizes();
        if (!(sizes instanceof Error)) {
            set(() => ({ sizes }));
        } else {
            set(() => ({ error: sizes.message }));
        }
    },
    setSizes: (payload) => set(() => ({ sizes: payload })),
    getColors: async () => {
        const colors = await getColors();
        if (!(colors instanceof Error)) {
            set(() => ({ colors }));
        } else {
            set(() => ({ error: colors.message }));
        }
    },
    setColors: (payload) => set(() => ({ colors: payload })),
    getTypes: async () => {
        const types = await getTypes();
        if (!(types instanceof Error)) {
            set(() => ({ types }));
        } else {
            set(() => ({ error: types.message }));
        }
    },
    setTypes: (payload) => set(() => ({ types: payload })),
    getItems: async ({ filters, currentPage }) => {
        const itemsObject = await getItems({ filters, currentPage });

        set((state) => {
            if (Array.isArray(state?.sizes)) {
                const sizes = [...get()?.sizes];
                state.sizes = sizes.map(size => {
                    const totalSizes = itemsObject.totalSizes.find(
                        i => i.stock__size__value === size.value
                    )?.total_sizes || 0;
                    return {...size, total: totalSizes};
                })
            }
        });

        if (!(itemsObject instanceof Error)) {
            set(() => ({ itemsObject }));
        } else {
            set(() => ({ error: itemsObject.message }));
        }
    },
    setItems: (payload) => {
        set((state) => {
            if (Array.isArray(state?.sizes)) {
                const sizes = [...get()?.sizes];
                state.sizes = sizes.map(size => {
                    const totalSizes = payload.totalSizes.find(
                        i => i.stock__size__value === size.value
                    )?.total_sizes || 0;
                    return {...size, total: totalSizes};
                });
            }
            //     COLORS
            //     TYPES
        })
    },
    checkSizes: (payload) => set((state) => {
        const filteredSize = [...state.filters].find(size =>
            size.id === payload
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
    }),
    uncheckSizes: () => set((state) => {
        state.sizes = [...state.sizes].map(i => {return {...i, checked: false}});
        const valuesToRemove = [...state.sizes].map(i => i.value);
        state.filters = state.filters.filter(i => !valuesToRemove.includes(i));
    }),
    checkColors: (payload) => set((state) => {
        const filteredColor = [...state.colors].find(color =>
            color.id === payload
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
    }),
    uncheckColors: () => set((state) => {
        state.colors = [...state.colors].map(i => {return {...i, checked: false}});
        const valuesToRemove = [...state.colors].map(i => i.value);
        state.filters = state.filters.filter(i => !valuesToRemove.includes(i));
    }),
    checkCategories: (payload) => set((state) => {
        const filteredCategory = [...state.categories].find(category =>
            category.id === payload
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
    }),
    uncheckCategories: () => set((state) => {
        state.categories = [...state.categories].map(i => {return {...i, checked: false}});
        const valuesToRemove = [...state.categories].map(i => i.value);
        state.filters = state.filters.filter(i => !valuesToRemove.includes(i));
    }),
    checkTypes: (payload) => set((state) => {
        const filteredType = [...state.types].find(type =>
            type.id === payload
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
    }),
    uncheckTypes: () => set((state) => {
        state.types = [...state.types].map(i => {return {...i, checked: false}});
        const valuesToRemove = [...state.types].map(i => i.value);
        state.filters = state.filters.filter(i => !valuesToRemove.includes(i));
    }),
    updateOrderBy: (payload) => set((state) => {
        // const name = sortOrder.find(i => i.value === payload).name;
        // const index = state.filters.findIndex(i => i === "descending" || i === "ascending");
        //
        // if (index === -1 && payload !== "") {
        //     state.filters.push(name);
        // } else if (index !== -1 && payload !== "") {
        //     state.filters[index] = name;
        // } else if (payload === "") {
        //     state.filters.splice(index, 1);
        // }
    }),
    resetFilters: () => set((state) => {
        state.sizes = [...state.sizes].map(item => {return {...item, checked: false}});
        state.colors = [...state.colors].map(item => {return {...item, checked: false}});
        state.types = [...state.types].map(item => {return {...item, checked: false}});
        state.filters = [];
    }),
}));

export const useWishlistStore = create((set) => ({
    wishlist: [],
    addWishlistItem: async (token, wishlistItem) => {
        const item = await addToWishlist({ token, data: wishlistItem });
        set((state) => ({ wishlist: state.wishlist.push(item) }));
    },
    getWishlist: async (token) => {
        const wishlist = await getWishlist({token});
        set((state) => ({ wishlist : wishlist }));
    },
    deleteWishlistItem: async (token, itemId) => {
        await deleteWishlistItem({token, itemId});
        set((state) => ({ wishlist: state.wishlist.filter((item) => item.id !== itemId) }));
    }
}));

export const useEmailStore = create((set) => ({
    error: null,
    email: null,
    isChangeEmailFormOpened: false,
    isEmailConfirmed: false,
    isEmailExists: false,
    isEmailChecked: false,
    setEmail: (payload) => set(() => ({email: payload})),
    sendEmail: async (token, to, subject, template) => {
        const isEmailExists = await sendEmail(token, to, subject, template);
        
        if (!(isEmailExists instanceof Error)) {
            set(() => ({ isEmailExists: true }));
        } else {
            set(() => ({ error: isEmailExists.message }));
        }
    },
    getEmail: async () => {
        const email = await getEmail();
        if (!(email instanceof Error)) {
            set(() => ({ email }));
        } else {
            set(() => ({ error: email.message }));
        }
    },
    changeEmail: async (data) => {
        const result = await changeEmail({ data });
        if (!(result instanceof Error)) {
            set(() => ({ email: result.email }));
        } else {
            set(() => ({ error: result.message }));
        }
    },
    checkEmail: async (token, data) => {

    },
    toggleChangeEmail: () => set((state) => ({ isChangeEmailFormOpened: !state.isChangeEmailFormOpened })),
    toggleConfirmEmail: () => set((state) => ({ isEmailConfirmed: !state.isEmailConfirmed })),
}));

export const useOrderStore = create((set, get) => ({
    error: null,
    orders: [],
    shippingMethods: [],
    computed: {
        lastOrder: () => {
            const orders = get().orders;
            if (orders && orders.length > 0) {
                return orders.at(-1);
            } else {
                return null;
            }
        }
    },
    getOrders: async () => {
        const orders = await getOrders();
        set(() => ({ orders }));
    },
    updateOrder: async (token, orderId, data) => {
        const order = await updateOrder({ token, orderId, data });
        if (!(order instanceof Error)) {
            set((state) => ({ orders: state.orders.map(o => o.id === orderId ? order : o) }));
        } else {
            set(() => ({ error: order.message }));
        }
    },
    getShippingMethods: async () => {
        const data = await getShippingMethods();
        if (!(data instanceof Error)) {
            set(() =>({ shippingMethods: data }));
        } else {
            set(() => ({ error: data.message }));
        }
    },
    setShippingMethods: (payload) => set(() => ({ shippingMethods: payload })),
}));

export const useCartStore = create((set, get) => ({
    error: null,
    cartItems: [],
    totalQuantityInCart: 0,
    totalPrice: 0,
    orderId: 0,
    isCartMenuOpen: false,
    addCartItem: async (token, data) => {
        const d = await addCartItem({ token, data });
        if (!(d instanceof Error)) {
            set(() => ({
                cartItems: d.data,
                totalQuantityInCart: d.total_quantity,
                totalPrice: d.total_price,
                orderId: d.order_id,
            }));
        } else {
            set(() => ({ error: d.message }));
        }
    },
    getCartItems: async () => {
        const data = await getCartItems();
        if (!(data instanceof Error)) {
            set(() => ({
                cartItems: data.data,
                totalQuantityInCart: data.total_quantity,
                totalPrice: data.total_price,
                orderId: data.order_id,
            }));
        } else {
            set(() => ({ error: data.message }));
        }
    },
    changeQuantity: async ({itemSrc, increaseStock, token, quantity=1}) => {
        const d = await changeQuantityInCart({itemSrc, increaseStock, token, quantity});
        if (!(d instanceof Error)) {
            set(() => ({
                cartItems: d.data,
                totalQuantityInCart: d.total_quantity,
                totalPrice: d.total_price,
                orderId: d.order_id,
            }));
        } else {
            set(() => ({ error: d.message }));
        }
    },
    deleteCart: async (token, hasOrdered) => {
        const result = await clearCart({ token, hasOrdered });
        if (!(result instanceof Error)) {
            set(() => ({
                cartItems: [],
                totalQuantityInCart: 0,
                totalPrice: 0,
                orderId: 0,
            }));
        } else {
            set(() => ({ error: result.message }));
        }
    },
    toggleCartMenu: (forced=false) => {
        if (forced) {
            set(() => ({ isCartMenuOpen: false }));
        } else {
            set((state) => {
                console.log(state.isCartMenuOpen);
                return ({ isCartMenuOpen: !state.isCartMenuOpen })
            })
        }
    },
}));

export const useAuthProvider = create((set) => ({
    isAuthenticated: false,
    isVerified: false,
    isRefreshed: false,
    signIn: async (username, password) => await AuthService.login({ username, password }),
    signUp: async (firstName, lastName, email, password, password2) =>
        await AuthService.register({ firstName, lastName, email, password, password2 }),
    verify: async (token) => {
        const isVerified = await AuthService.verify({token});
        set(() => ({ isVerified: typeof isVerified === "boolean" }));
    },
    refresh: async () => {
        const isRefreshed = await AuthService.refresh();
        set(() => ({ isRefreshed: typeof isRefreshed === "boolean" }));
    },
    signOut: async (token) => {
        await AuthService.logout({token});
        set(() => ({ isAuthenticated: false, isVerified: false, isRefreshed: false }));
    }
}));

export const useControlsStore = create((set) => ({
    isCartMenuOpen: false,
    isBurgerMenuOpen: false,
    isFiltersMenuOpen: false,
    isSizesMenuOpen: false,
    isColorsMenuOpen: false,
    isTypesMenuOpen: false,
    toggleCartMenu: (forced=false) => {
        if (forced) {
            set(() => ({ isCartMenuOpen: false }));
        } else {
            set((state) => ({isCartMenuOpen: !state.isCartMenuOpen}))
        }
    },
    toggleBurgerMenu: (forced=false) => {
        if (forced) {
            set(() => ({ isBurgerMenuOpen: false }));
        } else {
            set((state) => ({isBurgerMenuOpen: !state.isBurgerMenuOpen}))
        }
    },
    toggleFiltersMenu: (forced=false) => {
        if (forced) {
            set(() => ({ isFiltersMenuOpen: false }));
        } else {
            set((state) => ({isFiltersMenuOpen: !state.isFiltersMenuOpen}))
        }
    },
    toggleSizesMenu: (forced=false) => {
        if (forced) {
            set(() => ({ isSizesMenuOpen: false }));
        } else {
            set((state) => ({isSizesMenuOpen: !state.isSizesMenuOpen}))
        }
    },
    toggleColorsMenu: (forced=false) => {
        if (forced) {
            set(() => ({ isColorsMenuOpen: false }));
        } else {
            set((state) => ({isColorsMenuOpen: !state.isColorsMenuOpen}))
        }
    },
    toggleTypesMenu: (forced=false) => {
        if (forced) {
            set(() => ({ isTypesMenuOpen: false }));
        } else {
            set((state) => ({isTypesMenuOpen: !state.isTypesMenuOpen}))
        }
    }
}));

export const useErrorStore = create((set) => ({
    error: null,
    setError: (payload) => set(() => ({ error: payload.message })),
}));