import {createSlice} from "@reduxjs/toolkit";

const uiControlHeaderSlice = createSlice({
    name: "uiHeader",
    initialState: {
        visible1: false,
        visible2: false,
        visible3: false,
    },
    reducers: {
        setVisible: (state, action) => {
            state[action.payload.key] = !state[action.payload.key];
        }
    }
});

export const { setVisible } = uiControlHeaderSlice.actions;
export default uiControlHeaderSlice.reducer;
export const selectVisible1 = (state) => state.uiHeader.visible1;
export const selectVisible2 = (state) => state.uiHeader.visible2;
export const selectVisible3 = (state) => state.uiHeader.visible3;