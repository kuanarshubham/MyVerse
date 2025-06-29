import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    screenWidth: 100,
    screenHeight: 100
}

const spaceSlice = createSlice({
    name: "space",
    initialState,
    reducers: {
        
        calculateSpaceSize: (state, action) => {
            state.screenWidth = action.payload.width;
            state.screenHeight = action.payload.height;
        }
    }
});

export default spaceSlice.reducer;
export const {calculateSpaceSize} = spaceSlice.actions;