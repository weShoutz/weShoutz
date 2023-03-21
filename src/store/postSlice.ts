import { createSlice } from "@reduxjs/toolkit";
import { AppState } from "./store";
import { HYDRATE } from "next-redux-wrapper";


//Type for posts
export interface PostType {
  id: number;
  title?: string;
  createdAt: Date;
  message: string;
  recipient?: string;
  author: string;
  authorId: string;
  authorPic?: string;
}

/*
id        Int      @id @default(autoincrement())
    title     String   @default("")
    createdAt DateTime @default(now())
    message   String   @default("")
    recipient String   @default("")
    author    User     @relation(fields: [authorId], references: [id])
    authorId  String
    authorPic String?
*/

// Type for our state
export interface PostState {
  posts: PostType[];
}

// Initial state
const initialState: PostState = {
  posts: [],
};

// Actual Slice
export const postSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    // Action to set the authentication status
    setPostState(state, action) {
      console.log('reducer activated', state, action);
      const stateOne: PostState = action.payload;
      console.log(stateOne, 'line 48')
      const newState = state.posts.concat(stateOne)
      state.posts = newState;
      // console.log(state.posts, 'line 51')
    },

  },

  // Special reducer for hydrating the state. Special case for next-redux-wrapper
  extraReducers: {
    [HYDRATE]: (state, action): PostState => {
      return {
        ...state,
        ...action.payload.posts,
      };
    },
  },
});

export const { setPostState } = postSlice.actions;

export const selectPostState = (state: AppState) => state.posts.postState;
export default postSlice.reducer;
