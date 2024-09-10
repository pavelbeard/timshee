import { apiSlice } from "../../app/api/apiSlice";

export const refreshApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        refresh: builder.mutation({
            query: () => ({
                url: '/stuff/token/refresh/',
                method: 'POST',
            })
        })
    })
});

export const { useRefreshMutation } = refreshApiSlice;