// =================================================================
// FILE: src/lib/features/projectUpdate/projectUpdateApiSlice.ts
// =================================================================
import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../../api/baseQueryWithReauth";
import { postApiSlice } from "../post/postApiSlice";
import { ProjectUpdateApiResponse } from "./projectUpdateTypes";

export const projectUpdateApiSlice = createApi({
  reducerPath: "projectUpdateApi",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    addProjectUpdate: builder.mutation<
      ProjectUpdateApiResponse,
      { postId: string; formData: FormData }
    >({
      query: ({ postId, formData }) => ({
        url: `/posts/${postId}/journey`,
        method: "POST",
        body: formData,
      }),
      async onQueryStarted({ postId }, { dispatch, queryFulfilled }) {
        try {
          const { data: result } = await queryFulfilled;
          dispatch(
            postApiSlice.util.updateQueryData(
              "getPostById",
              postId,
              (draft) => {
                draft.projectJourney.unshift(result.data);
              }
            )
          );
        } catch (error) {
          console.error("Failed to add project update:", error);
        }
      },
    }),
    updateProjectUpdate: builder.mutation<
      ProjectUpdateApiResponse,
      { updateId: string; postId: string; formData: FormData }
    >({
      query: ({ updateId, formData }) => ({
        url: `/journey/${updateId}`,
        method: "PUT",
        body: formData,
      }),
      async onQueryStarted({ postId, updateId }, { dispatch, queryFulfilled }) {
        try {
          const { data: result } = await queryFulfilled;
          dispatch(
            postApiSlice.util.updateQueryData(
              "getPostById",
              postId,
              (draft) => {
                const index = draft.projectJourney.findIndex(
                  (u) => u.id === updateId
                );
                if (index !== -1) {
                  draft.projectJourney[index] = result.data;
                }
              }
            )
          );
        } catch (error) {
          console.error("Failed to update project update:", error);
        }
      },
    }),
    deleteProjectUpdate: builder.mutation<
      { message: string },
      { updateId: string; postId: string }
    >({
      query: ({ updateId }) => ({
        url: `/journey/${updateId}`,
        method: "DELETE",
      }),
      async onQueryStarted({ postId, updateId }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          postApiSlice.util.updateQueryData("getPostById", postId, (draft) => {
            draft.projectJourney = draft.projectJourney.filter(
              (u) => u.id !== updateId
            );
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),
  }),
});

export const {
  useAddProjectUpdateMutation,
  useUpdateProjectUpdateMutation,
  useDeleteProjectUpdateMutation,
} = projectUpdateApiSlice;
