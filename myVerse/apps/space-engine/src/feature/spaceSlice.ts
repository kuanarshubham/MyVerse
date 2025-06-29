import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    screenWidth: 100,
    screenHeight: 100
}

const spaceSlice = createSlice({
    name: "space",
    initialState,
    reducers: {
        
        calculateSpaceSize: (state) => {
            state.screenWidth = window.screen.width;
            state.screenHeight = window.screen.height;
        }
    }
});

export default spaceSlice.reducer;
export const {calculateSpaceSize} = spaceSlice.actions;