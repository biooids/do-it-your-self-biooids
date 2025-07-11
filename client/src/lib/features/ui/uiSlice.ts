// FILE: src/lib/features/ui/uiSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "@/lib/store";

type InteractionType =
  | "like"
  | "save"
  | "comment"
  | "share"
  | "view"
  | "perform this action";

interface UiState {
  isAuthModalOpen: boolean;
  interactionType: InteractionType;
}

const initialState: UiState = {
  isAuthModalOpen: false,
  interactionType: "perform this action",
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    openAuthModal(state, action: PayloadAction<InteractionType>) {
      state.isAuthModalOpen = true;
      state.interactionType = action.payload;
    },
    closeAuthModal(state) {
      state.isAuthModalOpen = false;
    },
  },
});

export const { openAuthModal, closeAuthModal } = uiSlice.actions;

export const selectAuthModalState = (state: RootState) => state.ui;

export default uiSlice.reducer;
