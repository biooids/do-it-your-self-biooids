// FILE: src/lib/features/comment/commentUiSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "@/lib/store";

interface CommentUiState {
  [commentId: string]: {
    isExpanded: boolean;
  };
}

const initialState: CommentUiState = {};

const commentUiSlice = createSlice({
  name: "commentUi",
  initialState,
  reducers: {
    toggleReplies(state, action: PayloadAction<string>) {
      const commentId = action.payload;
      if (!state[commentId]) {
        state[commentId] = { isExpanded: true };
      } else {
        state[commentId].isExpanded = !state[commentId].isExpanded;
      }
    },
  },
});

export const { toggleReplies } = commentUiSlice.actions;

export const selectIsRepliesExpanded = (state: RootState, commentId: string) =>
  state.commentUi[commentId]?.isExpanded ?? false;

export default commentUiSlice.reducer;
