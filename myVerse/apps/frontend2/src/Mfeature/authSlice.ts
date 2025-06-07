import { createSlice } from '@reduxjs/toolkit'
//import type { RootState } from '../store/Auth.store';


interface Signin {
    signin: boolean
}

const initialState: Signin = {
    signin: true
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {

        setSignin: (state: Signin) => {
            state.signin = !state.signin;
        }
    }
});

export default authSlice.reducer;
export const {setSignin} = authSlice.actions;
