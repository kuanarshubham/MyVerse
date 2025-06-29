import { createSlice } from "@reduxjs/toolkit";

interface TPeople{
    x: number,
    y: number
}

const initialState: TPeople = {
    x: 0,
    y: 0
}

const peopleSlice = createSlice({
    name: "people",
    initialState,
    reducers: {
        move: (state: TPeople, action) => {
            state.x = Math.floor(action.payload.x);
            state.y = action.payload.y;
        }
    }
});

export default peopleSlice.reducer;
export const {move} = peopleSlice.actions;