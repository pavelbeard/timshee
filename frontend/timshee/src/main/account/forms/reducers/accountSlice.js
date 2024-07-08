import {createSlice} from "@reduxjs/toolkit";
import {changeEmail, changePassword, checkEmail, checkResetPasswordRequest, refundWhole} from "./asyncThunks";

const initialState = {
    changedEmail: undefined,
    changeEmailStatus: 'idle',
    checkedEmail: null,
    checkEmailStatus: 'idle',
    changePassword: null,
    changePasswordStatus: 'idle'
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

            .addCase(checkEmail.pending, (state, action) => {
                state.checkEmailStatus = 'loading';
            })
            .addCase(checkEmail.fulfilled, (state, action) => {
                state.checkEmailStatus = 'success';
                state.checkedEmail = action.payload;
            })
            .addCase(checkEmail.rejected, (state, action) => {
                state.checkEmailStatus = 'error';
            })

            .addCase(changePassword.pending, (state, action) => {
                state.changePasswordStatus = 'loading';
            })
            .addCase(changePassword.fulfilled, (state, action) => {
                state.changePasswordStatus = 'success';
                state.checkPassword = action.payload;
            })
            .addCase(changePassword.rejected, (state, action) => {
                state.changePasswordStatus = 'error';
            })

            .addCase(checkResetPasswordRequest.pending, (state, action) => {
                state.isLinkValidStatus = 'loading';
            })
            .addCase(checkResetPasswordRequest.fulfilled, (state, action) => {
                state.isLinkValidStatus = 'success';
                state.isLinkValid = action.payload;
            })
            .addCase(checkResetPasswordRequest.rejected, (state, action) => {
                state.isLinkValidStatus = 'error';
            })
    }
});

export const {
    resetChangeEmailStatus
} = accountSlice.actions;
export default accountSlice.reducer;