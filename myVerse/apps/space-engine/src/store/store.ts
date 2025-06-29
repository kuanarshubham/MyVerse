import { configureStore } from '@reduxjs/toolkit'
import spaceReducer from "../feature/spaceSlice"

const store = configureStore({
  reducer: {
    space: spaceReducer
  },
});




// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch

export default store;