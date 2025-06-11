import { createSlice } from "@reduxjs/toolkit";

interface Nav{
    navBtn1: "default" | "outline" | null,
    navBtn2: "default" | "outline" | null
}

const initialState: Nav = {
    navBtn1: "default",
    navBtn2: "default"
}

const navSlice = createSlice({
    name: "nav",
    initialState,
    reducers: {
        setNavBtn1: (state: Nav, actions) => {
            state.navBtn1 = actions.payload.type
        },

        setNavBtn2: (state: Nav, actions) => {
            state.navBtn2 = actions.payload.type
        }
    }
});

export default navSlice.reducer;
export const {setNavBtn1, setNavBtn2} = navSlice.actions