import { apiSlice } from "../../services/app/api/apiSlice";
import { accountTags } from "./tags";

const tags = { ...accountTags };
const _apiSliceWithTags = apiSlice.enhanceEndpoints({
  addTagTypes: [...Object.values(tags)],
});

export const accountApiSlice = _apiSliceWithTags.injectEndpoints({
  endpoints: (builder) => ({
    // location
    getCountries: builder.query({
      query: () => ({
        url: "/order/countries/",
        method: "GET",
      }),
    }),
    // location
    getCountryByLanguage: builder.query({
      query: (lang) => ({
        url: `/order/countries?lang=${lang}`,
        method: "GET",
      }),
    }),
    getProvinces: builder.query({
      query: () => ({
        url: "/order/provinces/",
        method: "GET",
      }),
    }),
    getPhoneCodes: builder.query({
      query: () => ({
        url: "/order/phone-codes/",
        method: "GET",
      }),
    }),
    // addresses
    getAddressesByUser: builder.query({
      query: () => ({
        url: "/order/addresses/get_addresses_by_user/",
        method: "GET",
      }),
      // providesTags: (result) =>
      // result
      //     ? [tags.ADDRESSES_BY_USER, tags.EXP_ADDRESSES_BY_USER]
      //     : [result?.map(({ id }) => ({ type: 'ADDRESSES', id }))]
      providesTags: [tags.ADDRESSES_BY_USER, tags.EXP_ADDRESSES_BY_USER],
    }),
    postAddress: builder.mutation({
      query: (address) => ({
        url: "/order/addresses/",
        method: "POST",
        body: { ...address },
      }),
      invalidatesTags: [tags.ADDRESSES_BY_USER],
    }),
    putAddress: builder.mutation({
      query: (address) => ({
        url: `/order/addresses/${address.id}/`,
        method: "PUT",
        body: { ...address },
      }),
      invalidatesTags: [tags.ADDRESSES_BY_USER],
    }),
    deleteAddress: builder.mutation({
      query: (address) => ({
        url: `/order/addresses/${address.id}/`,
        method: "DELETE",
      }),
      invalidatesTags: [tags.ADDRESSES_BY_USER],
    }),
    // shipping methods
    getShippingMethods: builder.query({
      query: () => ({
        url: "/order/shipping-methods/",
        method: "GET",
      }),
    }),
    // orders
    getOrdersByUser: builder.query({
      query: () => ({
        url: "/order/orders/get_orders_by_user/",
        method: "GET",
      }),
    }),
  }),
});

export const {
  // location
  useGetCountryByLanguageQuery,
  useGetCountriesQuery,
  useGetProvincesQuery,
  useGetPhoneCodesQuery,
  // addresses
  useGetAddressesByUserQuery,
  usePostAddressMutation,
  usePutAddressMutation,
  useDeleteAddressMutation,
  // shippingMethods
  useGetShippingMethodsQuery,
  // orders
  useGetOrdersByUserQuery,
} = accountApiSlice;
