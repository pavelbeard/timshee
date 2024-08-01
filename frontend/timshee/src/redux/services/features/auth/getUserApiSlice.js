import { apiSlice } from '../../app/api/apiSlice';

export const getUserApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getCurrentUser: builder.mutation({
            query: () => ({
                url: '/stuff/profile/get_email/',
                method: 'GET',
            })
        })
    }),
    overrideExisting: false
});

export const { useGetCurrentUserMutation } = getUserApiSlice;