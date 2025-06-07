import { createSlice } from '@reduxjs/toolkit'
//import type { RootState } from '../store/Auth.store';


interface Signin {
    signin: boolean,
    token: string
}

const initialState: Signin = {
    signin: true,
    token: ""
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {

        setSignin: (state: Signin, actions) => {
            state.signin = actions.payload.value;
        },

        setToken: (state: Signin, actions) => {
            state.token = actions.payload.token
        }

        
    }
});

export default authSlice.reducer;
export const {setSignin, setToken} = authSlice.actions;
