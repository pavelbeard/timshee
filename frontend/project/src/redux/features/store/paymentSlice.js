import { createSlice } from "@reduxjs/toolkit";
import { apiSlice } from "../../services/app/api/apiSlice";
import { paymentStatusDict } from "../api/paymentApiSlice";

export const paymentSlice = createSlice({
  name: "payment",
  initialState: {
    confirmationUrl: null,
    paymentStatus: paymentStatusDict,
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      apiSlice.endpoints.createPayment.matchFulfilled,
      (state, action) => {
        state.confirmationUrl = action?.payload?.confirmation_url;
      },
    );
  },
});

export default paymentSlice.reducer;
export const selectConfirmationUrl = (state) => state.payment.confirmationUrl;
export const selectPaymentStatus = (state) => state.payment.paymentStatus;
