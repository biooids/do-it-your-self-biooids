// =================================================================
// FILE: src/lib/hooks/useAuthAction.ts (NEW FILE)
// =================================================================
"use client";

import { useAppSelector } from "./hooks";
import { selectCurrentUser } from "../features/user/userSlice";
import { useAppDispatch } from "./hooks";
import { openAuthModal } from "../features/ui/uiSlice";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

type InteractionType =
  | "like"
  | "save"
  | "comment"
  | "share"
  | "view"
  | "perform this action";

/**
 * A custom hook to conditionally perform an action based on user authentication.
 * If the user is not authenticated, it opens a friendly "login required" modal.
 * @returns A function that takes a callback to execute if the user is logged in.
 */
export const useAuthAction = () => {
  const currentUser = useAppSelector(selectCurrentUser);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleAuthAction = (
    action: () => void,
    interactionType: InteractionType = "perform this action"
  ) => {
    if (currentUser) {
      action();
    } else {
      // Instead of redirecting, open the modal
      dispatch(openAuthModal(interactionType));
    }
  };

  return handleAuthAction;
};
