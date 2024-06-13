import {createSlice} from "@reduxjs/toolkit";
import {changeEmail} from "./asyncThunks";

const initialState = {
    changedEmail: undefined,
    changeEmailStatus: 'idle',
};

const accountSlice = createSlice({
    name: "account",
    initialState,
    reducers: {
        resetChangeEmailStatus: (state) => {
            state.changeEmailStatus = 'idle';
        },
    },
    extraReducers: builder => {
        builder
            .addCase(changeEmail.pending, (state, action) => {
                state.changeEmailStatus = 'loading';
            })
            .addCase(changeEmail.fulfilled, (state, action) => {
                state.changeEmailStatus = 'success';
                state.changedEmail = action.payload;
            })
            .addCase(changeEmail.rejected, (state, action) => {
                state.changeEmailStatus = 'error';
            })
    }
});

export const {
    resetChangeEmailStatus
} = accountSlice.actions;
export default accountSlice.reducer;