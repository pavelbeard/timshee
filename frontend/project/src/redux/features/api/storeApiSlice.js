import { apiSlice } from "../../services/app/api/apiSlice";
import { storeTags } from "./tags";

const tags = storeTags;

const _apiSliceWithTags = apiSlice.enhanceEndpoints({
  addTagTypes: [
    tags.GET_WISHLIST_ITEM,
    tags.GET_WISHLIST_BY_USER,
    tags.ADD_WISHLIST_ITEM,
    tags.DELETE_WISHLIST_ITEM,
  ],
});

export const storeApiSlice = _apiSliceWithTags.injectEndpoints({
  endpoints: (builder) => ({
    getItem: builder.query({
      query: (id) => ({
        url: `/store/items/${id}/get_item_with_in_stock/`,
        method: "GET",
      }),
    }),
    getWishlistByUser: builder.query({
      query: () => ({
        url: "/store/wishlist/get_wishlist_by_user/",
        method: "GET",
      }),
      providesTags: [tags.GET_WISHLIST_BY_USER],
    }),
    getWishlistItem: builder.query({
      query: (filters) => ({
        url: `/store/wishlist/${filters ? `?${filters}` : ""}`,
        method: "GET",
      }),
      providesTags: [tags.GET_WISHLIST_ITEM, tags.GET_WISHLIST_BY_USER],
    }),
    addWishlistItem: builder.mutation({
      query: (data) => ({
        url: "/store/wishlist/add_item/",
        method: "POST",
        body: { ...data },
      }),
      invalidatesTags: [tags.GET_WISHLIST_ITEM, tags.GET_WISHLIST_BY_USER],
    }),
    deleteWishlistItem: builder.mutation({
      query: (id) => ({
        url: `/store/wishlist/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: [tags.GET_WISHLIST_ITEM, tags.GET_WISHLIST_BY_USER],
    }),
    getStoreData: builder.query({
      queryFn: async (arg, api, extraOptions, baseQuery) => {
        const responses = await Promise.allSettled([
          baseQuery("/store/sizes/"),
          baseQuery("/store/colors/"),
          baseQuery("/store/types/"),
          baseQuery("/store/collections/"),
          baseQuery("/store/categories/"),
        ]);

        return {
          data: {
            sizes:
              responses[0].status === "fulfilled"
                ? responses[0]?.value?.data?.map((i) => ({
                    ...i,
                    checked: false,
                  }))
                : [],
            colors:
              responses[1].status === "fulfilled"
                ? responses[1]?.value?.data?.map((i) => ({
                    ...i,
                    checked: false,
                  }))
                : [],
            types:
              responses[2].status === "fulfilled"
                ? responses[2]?.value?.data?.map((i) => ({
                    ...i,
                    checked: false,
                  }))
                : [],
            collections:
              responses[3].status === "fulfilled"
                ? responses[3]?.value?.data?.map((i) => ({
                    ...i,
                    checked: false,
                  }))
                : [],
            categories:
              responses[4].status === "fulfilled"
                ? responses[4]?.value?.data?.map((i) => ({
                    ...i,
                    checked: false,
                  }))
                : [],
          },
        };
      },
    }),
  }),
});

export const {
  useGetItemQuery,
  useLazyGetWishlistByUserQuery,
  useGetWishlistItemQuery,
  useAddWishlistItemMutation,
  useDeleteWishlistItemMutation,
  useGetStoreDataQuery,
} = storeApiSlice;
