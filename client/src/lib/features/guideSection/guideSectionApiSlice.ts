// =================================================================
// FILE: src/lib/features/guideSection/guideSectionApiSlice.ts
// =================================================================
import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../../api/baseQueryWithReauth";
import { postApiSlice } from "../post/postApiSlice";
import { GuideSectionApiResponse } from "./guideTypes";

export const guideSectionApiSlice = createApi({
  reducerPath: "guideSectionApi",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    addGuideSection: builder.mutation<
      GuideSectionApiResponse,
      { stepId: string; postId: string; formData: FormData }
    >({
      query: ({ stepId, formData }) => ({
        url: `/steps/${stepId}/sections`,
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
                const step = draft.steps.find(
                  (s) => s.id === result.data.stepId
                );
                if (step) {
                  step.sections.push(result.data);
                  step.sections.sort((a, b) => a.order - b.order);
                }
              }
            )
          );
        } catch (error) {
          console.error("Failed to add section:", error);
        }
      },
    }),
    updateGuideSection: builder.mutation<
      GuideSectionApiResponse,
      { sectionId: string; postId: string; formData: FormData }
    >({
      query: ({ sectionId, formData }) => ({
        url: `/sections/${sectionId}`,
        method: "PUT",
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
                const step = draft.steps.find(
                  (s) => s.id === result.data.stepId
                );
                if (step) {
                  const sectionIndex = step.sections.findIndex(
                    (sec) => sec.id === result.data.id
                  );
                  if (sectionIndex !== -1) {
                    step.sections[sectionIndex] = result.data;
                  }
                  step.sections.sort((a, b) => a.order - b.order);
                }
              }
            )
          );
        } catch (error) {
          console.error("Failed to update section:", error);
        }
      },
    }),
    deleteGuideSection: builder.mutation<
      void,
      { sectionId: string; postId: string }
    >({
      query: ({ sectionId }) => ({
        url: `/sections/${sectionId}`,
        method: "DELETE",
      }),
      async onQueryStarted(
        { postId, sectionId },
        { dispatch, queryFulfilled }
      ) {
        const patchResult = dispatch(
          postApiSlice.util.updateQueryData("getPostById", postId, (draft) => {
            for (const step of draft.steps) {
              const sectionIndex = step.sections.findIndex(
                (s) => s.id === sectionId
              );
              if (sectionIndex !== -1) {
                step.sections.splice(sectionIndex, 1);
                break;
              }
            }
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
  useAddGuideSectionMutation,
  useUpdateGuideSectionMutation,
  useDeleteGuideSectionMutation,
} = guideSectionApiSlice;
