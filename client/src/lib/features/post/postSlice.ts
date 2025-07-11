// FILE: src/lib/features/post/postSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { postApiSlice } from "./postApiSlice";
import { PostsState, GetPostsApiResponse } from "./postTypes";

const initialState: PostsState = {
  posts: [],
};

const postSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    // Other client-side reducers could be added here later if needed.
  },
  extraReducers: (builder) => {
    // When the getPosts query is fulfilled, this updates the local 'posts' state.
    builder.addMatcher(
      postApiSlice.endpoints.getPosts.matchFulfilled,
      (state, action: PayloadAction<GetPostsApiResponse>) => {
        state.posts = action.payload.data;
      }
    );
  },
});

export default postSlice.reducer;
