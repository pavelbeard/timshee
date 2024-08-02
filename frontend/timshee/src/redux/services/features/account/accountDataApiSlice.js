import { apiSlice } from "../../app/api/apiSlice";

export const accountDataApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getCountries: builder.mutation({
            query: () => ({
                url: '/order/countries/',
                method: 'GET',
            })
        }),
        getProvinces: builder.mutation({
            query: () => ({
                url: '/order/provinces/',
                method: 'GET',
            })
        }),
        getPhoneCodes: builder.mutation({
            query: () => ({
                url: '/order/phone-codes/',
                method: 'GET',
            })
        }),
        getAddressesByUser: builder.mutation({
            query: () => ({
                url: '/order/addresses/get_addresses_by_user/',
                method: 'GET',
            })
        }),
        createAddress: builder.mutation({
            query: (address) => ({
                url: '/order/addresses/',
                method: 'POST',
                body: { ...address },
            })
        }),
        updateAddress: builder.mutation({
            query: (address) => ({
                url: `/order/addresses/${address.id}/`,
                method: 'PUT',
                body: { ...address },
            })
        }),
        deleteAddress: builder.mutation({
            query: (address) => ({
                url: `/order/addresses/${address.id}/`,
                method: 'DELETE',
            })
        })
    })
});

export const {
    // objects
    useGetCountriesMutation,
    useGetProvincesMutation,
    useGetPhoneCodesMutation,
    useGetAddressesByUserMutation,
    // form
    useCreateAddressMutation,
    useUpdateAddressMutation,
    useDeleteAddressMutation,
} = accountDataApiSlice;