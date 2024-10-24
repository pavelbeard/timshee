import { apiSlice } from "../../services/app/api/apiSlice";
import { authTags, stuffTags } from "./tags";

const tags = { ...authTags, ...stuffTags };

export const stuffApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getDynamicSettings: builder.query({
      query: () => ({
        url: "/stuff/settings/",
        method: "GET",
      }),
    }),
    getEmailConfirmationStatus: builder.query({
      query: () => ({
        url: "/stuff/profile/get_email_confirmation_status/",
        method: "GET",
      }),
      providesTags: [tags.CONFIRM_EMAIL],
      transformResponse(baseQueryReturnValue, meta, arg) {
        return baseQueryReturnValue?.confirmed || null;
      },
    }),
    generateToken: builder.mutation({
      query: (data) => ({
        url: "/stuff/profile/generate_verification_token/",
        method: "POST",
        body: { ...data },
      }),
    }),
    changeEmail: builder.mutation({
      query: (data) => ({
        url: "/stuff/profile/change_email/",
        method: "PUT",
        body: { ...data },
      }),
      invalidatesTags: [tags.CHANGE_EMAIL, tags.CONFIRM_EMAIL],
    }),
    checkEmail: builder.query({
      query: (data) => ({
        url: "/stuff/profile/check_email/",
        method: "POST",
        body: { ...data },
      }),
    }),
    checkResetPasswordRequest: builder.query({
      query: (data) => ({
        url: `stuff/profile/is_reset_password_request_valid/`,
        method: "POST",
        body: { ...data },
      }),
    }),
    changePassword: builder.mutation({
      query: (data) => ({
        url: "/stuff/profile/change_password/",
        method: "POST",
        body: { ...data },
      }),
    }),
    getLanguages: builder.query({
      query: () => ({
        url: "/stuff/lang/get_languages/",
        method: "GET",
      }),
      providesTags: [tags.CHANGE_LANGUAGE],
    }),
    getCurrentLanguage: builder.query({
      query: () => ({
        url: "/stuff/lang/get_current_language/",
        method: "GET",
      }),
    }),
    changeLanguage: builder.mutation({
      query: (data) => ({
        url: "/stuff/lang/change_language/",
        method: "POST",
        body: { ...data },
      }),
      invalidatesTags: [tags.CHANGE_LANGUAGE],
    }),
  }),
});

export const {
  useGetDynamicSettingsQuery,
  useChangeEmailMutation,
  useGetEmailConfirmationStatusQuery,
  useGenerateTokenMutation,
  useLazyCheckEmailQuery,
  useCheckResetPasswordRequestQuery,
  useChangePasswordMutation,
  useGetLanguagesQuery,
  useGetCurrentLanguageQuery,
  useChangeLanguageMutation,
} = stuffApiSlice;
