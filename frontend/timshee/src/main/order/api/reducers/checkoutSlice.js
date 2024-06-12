import {createSlice} from "@reduxjs/toolkit";
import {createOrUpdateAddress, updatePaymentInfo} from "../asyncThunks";

const initialState = {
    // general values
    isLoading: false,
    isError: false,

    //

    createOrUpdateAddressStatus: false,
    address: undefined,
    // light objects
    totalPrice: 0.00,
    paymentId: 0,
    orderHasDeleted: false,
    // heavy objects
    orderedData: [],
};

const checkoutSlice = createSlice({
    name: "checkout",
    initialState,
    reducers: {
        setIsLoading: (state, action) => {
            state.isLoading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
        setTotalPrice: (state, action) => {
            state.totalPrice = action.payload;
        },
        setOrderedData: (state, action) => {
            state.orderedData = action.payload;
        },
        setPaymentId: (state, action) => {
            state.paymentId = action.payload;
        }
    },
    extraReducers: builder =>  {
        builder
            .addCase(updatePaymentInfo.pending, (state, action) => {
                state.isLoading = true;
            })
            .addCase(updatePaymentInfo.fulfilled, (state, action) => {
                state.isLoading = false;

            })
            .addCase(updatePaymentInfo.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })

            .addCase(createOrUpdateAddress.pending, (state, action) => {
                state.createOrUpdateAddressStatus = 'loading';
            })
            .addCase(createOrUpdateAddress.fulfilled, (state, action) => {
                state.createOrUpdateAddressStatus = 'success';
                state.address = action.payload;
            })
            .addCase(createOrUpdateAddress.rejected, (state, action) => {
                state.createOrUpdateAddressStatus = 'error';
                state.error = action.payload;
            })
    }
});

export const {
    setIsLoading,
    setError,
    setTotalPrice,
    setOrderedData,
    setPaymentId,
} = checkoutSlice.actions;
export default checkoutSlice.reducer;