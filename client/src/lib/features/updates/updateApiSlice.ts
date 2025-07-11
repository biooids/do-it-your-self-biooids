// =================================================================
// FILE: src/lib/features/updates/updateApiSlice.ts
// =================================================================
import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "@/lib/api/baseQueryWithReauth";
import {
  UpdateDto,
  GetUpdatesParams,
  GetUpdatesResponse,
  GetUpdateResponse,
  CreateUpdatePayload,
  UpdateUpdatePayload,
} from "./updateTypes";

export const updateApiSlice = createApi({
  reducerPath: "updateApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Update"],
  endpoints: (builder) => ({
    getUpdates: builder.query<GetUpdatesResponse, GetUpdatesParams | void>({
      query: (params) => ({ url: "/updates", params: params || {} }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: "Update" as const, id })),
              { type: "Update", id: "LIST" },
            ]
          : [{ type: "Update", id: "LIST" }],
    }),
    getUpdate: builder.query<UpdateDto, string>({
      query: (id) => `/updates/${id}`,
      transformResponse: (response: GetUpdateResponse) => response.data,
      providesTags: (result, error, id) => [{ type: "Update", id }],
    }),
    createUpdate: builder.mutation<UpdateDto, CreateUpdatePayload>({
      query: (body) => ({ url: "/updates", method: "POST", body }),
      transformResponse: (response: GetUpdateResponse) => response.data,
      // The complex onQueryStarted block is completely gone.
      invalidatesTags: [{ type: "Update", id: "LIST" }],
    }),
    updateUpdate: builder.mutation<UpdateDto, UpdateUpdatePayload>({
      query: ({ id, ...body }) => ({
        url: `/updates/${id}`,
        method: "PATCH",
        body,
      }),
      transformResponse: (response: GetUpdateResponse) => response.data,
      invalidatesTags: (result, error, { id }) => [
        { type: "Update", id },
        { type: "Update", id: "LIST" }, // <-- Add this to refresh the list page
      ],
    }),

    deleteUpdate: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({ url: `/updates/${id}`, method: "DELETE" }),
      invalidatesTags: [{ type: "Update", id: "LIST" }],
    }),
  }),
});

export const {
  useGetUpdatesQuery,
  useGetUpdateQuery,
  useCreateUpdateMutation,
  useUpdateUpdateMutation,
  useDeleteUpdateMutation,
} = updateApiSlice;
