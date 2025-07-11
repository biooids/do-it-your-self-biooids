// =================================================================
// FILE: src/lib/features/comment/commentApiSlice.ts
// =================================================================
import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../../api/baseQueryWithReauth";
import { postApiSlice } from "@/lib/features/post/postApiSlice"; // <-- ADD THIS IMPORT

import type {
  GetCommentsForPostParams,
  GetCommentsResponse,
  GetRepliesForCommentParams,
  GetRepliesResponse,
  CreateCommentPayload,
  ReplyToCommentPayload,
  UpdateCommentPayload,
  DeleteCommentPayload,
  ToggleCommentReactionPayload,
  ToggleCommentReactionResponse,
  ProcessedCommentAPI,
} from "./commentTypes";

export const commentApiSlice = createApi({
  reducerPath: "commentApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Comment", "Post", "Posts"],
  endpoints: (builder) => ({
    getCommentsForPost: builder.query<
      GetCommentsResponse,
      GetCommentsForPostParams
    >({
      query: ({ postId, ...params }) => ({
        url: `/posts/${postId}/comments`,
        params,
      }),
      providesTags: (result, error, { postId }) => [
        { type: "Comment", id: `LIST-${postId}` },
      ],
    }),
    getRepliesForComment: builder.query<
      GetRepliesResponse,
      GetRepliesForCommentParams
    >({
      query: ({ parentId, ...params }) => ({
        url: `/comments/${parentId}/replies`,
        params,
      }),
      providesTags: (result, error, { parentId }) => [
        { type: "Comment", id: `REPLIES-${parentId}` },
      ],
    }),

    createCommentOnPost: builder.mutation<
      ProcessedCommentAPI,
      CreateCommentPayload
    >({
      query: ({ postId, text }) => ({
        url: `/posts/${postId}/comments`,
        method: "POST",
        body: { text },
      }),
      invalidatesTags: (result, error, { postId }) => [
        { type: "Comment", id: `LIST-${postId}` },
      ],
      async onQueryStarted({ postId }, { dispatch, queryFulfilled }) {
        // --- START OF DEBUGGING BLOCK ---

        console.log("--- Comment Mutation Started ---");
        console.log("Post ID to refetch:", postId);

        // This is a critical check. If postId is missing, we know why it fails.
        if (!postId) {
          console.error(
            "CRITICAL: postId is missing in onQueryStarted. Cannot refetch post."
          );
          return;
        }

        try {
          await queryFulfilled;
          console.log(
            "Comment mutation successful. Now attempting to refetch post..."
          );

          // We are adding { forceRefetch: true } to be absolutely sure it runs.
          dispatch(
            postApiSlice.endpoints.getPostById.initiate(postId, {
              forceRefetch: true,
            })
          );

          console.log("Dispatched action to refetch post.");

          // --- END OF DEBUGGING BLOCK ---
        } catch (err) {
          console.error("Mutation failed, not refetching post:", err);
        }
      },
    }),
    replyToComment: builder.mutation<
      ProcessedCommentAPI,
      ReplyToCommentPayload
    >({
      query: ({ parentId, text }) => ({
        url: `/comments/${parentId}/replies`,
        method: "POST",
        body: { text },
      }),
      invalidatesTags: (result, error, { parentId, postId }) => [
        { type: "Comment", id: `REPLIES-${parentId}` },
        { type: "Comment", id: `LIST-${postId}` },
      ],
      async onQueryStarted({ postId }, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(postApiSlice.endpoints.getPostById.initiate(postId));
        } catch (err) {
          console.error("Failed to post reply:", err);
        }
      },
    }),
    updateComment: builder.mutation<ProcessedCommentAPI, UpdateCommentPayload>({
      query: ({ commentId, text }) => ({
        url: `/comments/${commentId}`,
        method: "PATCH",
        body: { text },
      }),
      invalidatesTags: (result, error, { postId, parentId }) => [
        { type: "Comment", id: `LIST-${postId}` },
        ...(parentId
          ? [{ type: "Comment" as const, id: `REPLIES-${parentId}` }]
          : []),
      ],
    }),
    deleteComment: builder.mutation<void, DeleteCommentPayload>({
      query: ({ commentId }) => ({
        url: `/comments/${commentId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { postId, parentId }) => [
        { type: "Comment", id: `LIST-${postId}` },
        ...(parentId
          ? [{ type: "Comment" as const, id: `REPLIES-${parentId}` }]
          : []),
      ],
      async onQueryStarted({ postId }, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(postApiSlice.endpoints.getPostById.initiate(postId));
        } catch (err) {
          console.error("Failed to delete comment:", err);
        }
      },
    }),
    toggleCommentReaction: builder.mutation<
      ToggleCommentReactionResponse,
      ToggleCommentReactionPayload
    >({
      query: ({ commentId, reaction }) => ({
        url: `/comments/${commentId}/react`,
        method: "POST",
        body: { reaction },
      }),
      invalidatesTags: (result, error, { postId, parentId }) => [
        { type: "Comment", id: `LIST-${postId}` },
        ...(parentId
          ? [{ type: "Comment" as const, id: `REPLIES-${parentId}` }]
          : []),
      ],
    }),
  }),
});

export const {
  useGetCommentsForPostQuery,
  useGetRepliesForCommentQuery,
  useCreateCommentOnPostMutation,
  useReplyToCommentMutation,
  useUpdateCommentMutation,
  useDeleteCommentMutation,
  useToggleCommentReactionMutation,
} = commentApiSlice;
