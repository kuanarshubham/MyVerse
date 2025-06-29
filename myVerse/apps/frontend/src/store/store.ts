import { configureStore } from '@reduxjs/toolkit'
import authReducer from "../feature/authSlice";
import navReducer from "../feature/navSlice";
import spaceReducer from "../feature/spaceSlice";
import peopleReducer from "../feature/people.Slice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    nav: navReducer,
    space: spaceReducer,
    people: peopleReducer
  },
});




// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch

export default store;