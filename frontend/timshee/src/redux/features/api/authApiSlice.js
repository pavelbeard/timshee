import {apiSlice} from "../../services/app/api/apiSlice";
import {accountTags, authTags, cartTags, storeTags} from "./tags";

const tags = {
    ...cartTags,
    ...storeTags,
    ...authTags,
    ...accountTags,
};

const _apiSliceWithTags = apiSlice.enhanceEndpoints({
    addTagTypes: [
        ...Object.values(tags)
    ]
});

export const authApiSlice = _apiSliceWithTags.injectEndpoints({
    endpoints: builder => ({
        // profile
        getUser: builder.query({
            query: () => ({
                url: '/stuff/profile/get_email/',
                method: 'GET',
            }),
            transformResponse: res => res?.email,
            providesTags: [tags.SIGN_IN, tags.SIGN_OUT]
        }),
        changeUsername: builder.mutation({
            query: (data) => ({
                'url': '/stuff/profile/change_email/',
                method: 'POST',
                body: {...data},
            })
        }),
        signIn: builder.mutation({
            query: (credentials) => ({
                url: '/stuff/auth/sign_in/',
                method: 'POST',
                body: {...credentials}
            }),
            invalidatesTags: [tags.SIGN_IN, tags.GET_CART_ITEMS, tags.GET_WISHLIST_BY_USER]
        }),
        signUp: builder.mutation({
            query: (credentials) => ({
                url: '/stuff/auth/sign_up/',
                method: 'POST',
                body: {...credentials}
            }),
        }),
        signOut: builder.mutation({
            query: () => ({
                url: '/stuff/auth/sign_out/',
                method: 'POST',
            }),
            invalidatesTags: [
                tags.SIGN_OUT,
                tags.GET_CART_ITEMS,
                tags.GET_WISHLIST_BY_USER
            ]
        }),
        refresh: builder.query({
            query: () => ({
                url: '/stuff/token/refresh/',
                method: 'POST',
            }),
            providesTags: [tags.CHANGE_EMAIL],
            invalidatesTags: [
                tags.SIGN_IN,
                tags.SIGN_OUT,
                tags.GET_CART_ITEMS,
                tags.GET_WISHLIST_BY_USER,
                tags.ADDRESSES_BY_USER
            ]
        }),
    })
});

export const {
    // profile
    useSignInMutation,
    useSignUpMutation,
    useSignOutMutation,
    useRefreshQuery,
} = authApiSlice;