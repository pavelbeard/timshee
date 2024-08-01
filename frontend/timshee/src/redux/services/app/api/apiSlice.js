import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_URL } from "../../../../config";
import {setCredentials, signOut} from "../../features/auth/authSlice";

const baseQuery = fetchBaseQuery({
    baseUrl: `${API_URL}/api`,
    credentials: 'include',
    prepareHeaders: (headers, { getState }) => {
        const token = getState().auth.token;
        if (token) {
            headers.set("authorization", `Bearer ${token}`);
        }
        return headers;
    }
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions);

    if (result?.error?.originalStatus === 403 || result?.error?.code === 401) {
        console.log('refreshing access token')
        const refreshResult = await baseQuery('/stuff/token/refresh/', api, extraOptions);
        if (refreshResult?.access) {
            const user = api.getState().auth.user;
            api.dispatch(setCredentials({ ...refreshResult.access, user }));
            result = await baseQuery(args, api, extraOptions);
        } else {
            api.dispatch(signOut())
        }
    }
    return result;
}

export const apiSlice = createApi({
    baseQuery: baseQueryWithReauth,
    endpoints: builder => ({}),
});