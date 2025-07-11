// =================================================================
// FILE: src/lib/features/guideSection/guideStepApiSlice.ts
// =================================================================
import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../../api/baseQueryWithReauth";
import { postApiSlice } from "../post/postApiSlice";
import { GuideStepDto } from "./guideTypes";

export const guideStepApiSlice = createApi({
  reducerPath: "guideStepApi",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    addGuideStep: builder.mutation<
      { data: GuideStepDto },
      { postId: string; data: any }
    >({
      query: ({ postId, data }) => ({
        url: `/posts/${postId}/steps`,
        method: "POST",
        body: data,
      }),
      async onQueryStarted({ postId }, { dispatch, queryFulfilled }) {
        try {
          const { data: result } = await queryFulfilled;
          dispatch(
            postApiSlice.util.updateQueryData(
              "getPostById",
              postId,
              (draft) => {
                draft.steps.push({ ...result.data, sections: [] });
                draft.steps.sort((a, b) => a.order - b.order);
              }
            )
          );
        } catch (error) {
          console.error("Failed to add step", error);
        }
      },
    }),
    updateGuideStep: builder.mutation<
      { data: GuideStepDto },
      { stepId: string; postId: string; data: any }
    >({
      query: ({ stepId, data }) => ({
        url: `/steps/${stepId}`,
        method: "PUT",
        body: data,
      }),
      async onQueryStarted({ postId, stepId }, { dispatch, queryFulfilled }) {
        try {
          const { data: result } = await queryFulfilled;
          dispatch(
            postApiSlice.util.updateQueryData(
              "getPostById",
              postId,
              (draft) => {
                const stepIndex = draft.steps.findIndex((s) => s.id === stepId);
                if (stepIndex !== -1) {
                  draft.steps[stepIndex] = {
                    ...draft.steps[stepIndex],
                    ...result.data,
                  };
                }
                draft.steps.sort((a, b) => a.order - b.order);
              }
            )
          );
        } catch (error) {
          console.error("Failed to update step", error);
        }
      },
    }),
    deleteGuideStep: builder.mutation<void, { stepId: string; postId: string }>(
      {
        query: ({ stepId }) => ({ url: `/steps/${stepId}`, method: "DELETE" }),
        async onQueryStarted({ postId, stepId }, { dispatch, queryFulfilled }) {
          const patchResult = dispatch(
            postApiSlice.util.updateQueryData(
              "getPostById",
              postId,
              (draft) => {
                draft.steps = draft.steps.filter((s) => s.id !== stepId);
              }
            )
          );
          try {
            await queryFulfilled;
          } catch {
            patchResult.undo();
          }
        },
      }
    ),
  }),
});

export const {
  useAddGuideStepMutation,
  useUpdateGuideStepMutation,
  useDeleteGuideStepMutation,
} = guideStepApiSlice;
