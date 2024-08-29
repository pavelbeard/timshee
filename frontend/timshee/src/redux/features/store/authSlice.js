import {createSlice} from "@reduxjs/toolkit";
import {apiSlice} from "../../services/app/api/apiSlice";

const authSlice = createSlice({
    name: "auth",
    initialState: { user: null, token: null },
    reducers: {
        setToken: (state, action) => {
            state.token = action.payload.token;
        },
        setUser: (state, action) => {
            state.user = action.payload.user;
        },
        signOut: (state) => {
            state.user = null;
            state.token = null;
        }
    },
    extraReducers: builder => {
        builder
            .addMatcher(apiSlice.endpoints.getUser.matchFulfilled, (state, action) => {
                state.user = action?.payload;
            })
            .addMatcher(apiSlice.endpoints.refresh.matchFulfilled, (state, action) => {
                state.token = action?.payload?.access;
                state.user = action?.payload?.user;
            })
    }
});

export const { setToken, setUser, signOut } = authSlice.actions;
export default authSlice.reducer;
export const selectCurrentUser = (state) => state.auth.user;
export const selectCurrentToken = (state) => state.auth.token;

export class setCredentials {
}