import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";

const API_URL = process.env.REACT_APP_API_URL;

const initialState = {
    token: localStorage.getItem("token") || null,
    isValid: false,
    isLoading: false,
    error: null,
}

export const logout = createAsyncThunk(
    "auth/logout",
    async(arg, thunkAPI) => {
        try {
            const csrftoken = localStorage.getItem("csrftoken");
            await fetch(API_URL + "api/stuff/logout/", {
                method: "POST",
                headers: {
                    "Authorization": "Token " + localStorage.getItem("token"),
                    "Content-Type": "application/json",
                    "X-CSRFToken": csrftoken,
                },
                credentials: "include",
            });

            localStorage.removeItem("token");
            localStorage.removeItem("userName");
            localStorage.removeItem("userId");

            return false;
        } catch (e) {
            thunkAPI.rejectWithValue(e);
        }
    }
)

export const checkAuthStatus = createAsyncThunk(
    "auth/checkAuthSlice",
    async (arg, thunkAPI) => {
        try {
            const response = await fetch(API_URL + "api/stuff/check-auth/", {
                headers: {
                    'Authorization': `Token ${localStorage.getItem("token")}`,
                },
                credentials: "include",
            });

            if (response.ok) {
                const json = await response.json();
                if (json.authenticated) {
                    localStorage.setItem("userId", json.user);
                    localStorage.setItem("userName", json.user_name);
                    return true;
                } else {
                    return false;
                }
            } else if (response.status === 401) {
                return thunkAPI.rejectWithValue(response.statusText);
            }
        } catch (e) {

        }
    }
);

const checkAuthSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(checkAuthStatus.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(checkAuthStatus.fulfilled, (state, action) => {
                state.isValid = action.payload;
                state.isLoading = false;
                state.error = null;
            })
            .addCase(checkAuthStatus.rejected, (state, action) => {
                state.isValid = false;
                state.isLoading = false;
                state.error = action.payload;
            })
            .addCase(logout.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(logout.fulfilled, (state, action) => {
                state.isValid = action.payload;
                state.isLoading = false;
            })
            .addCase(logout.rejected, (state, action) => {
                state.error = action.payload;
                state.isValid = false;
                state.isLoading = false;
            });
    }
});

export default checkAuthSlice.reducer;