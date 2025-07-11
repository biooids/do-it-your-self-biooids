// =================================================================
// FILE: src/lib/features/user/userApiSlice.ts
// =================================================================
import { createApi } from "@reduxjs/toolkit/query/react";
import { getSession } from "next-auth/react";
import { baseQueryWithReauth } from "../../api/baseQueryWithReauth";
import { loggedOut } from "../auth/authSlice";
import {
  uploadStarted,
  uploadProgressUpdated,
  uploadSucceeded,
  uploadFailed,
} from "../upload/uploadProgressSlice";
import type {
  SanitizedUserDto,
  GetMeApiResponse,
  UpdateProfileApiResponse,
  UserProfile,
  GetUserApiResponse,
} from "./userTypes";

export const userApiSlice = createApi({
  reducerPath: "userApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Me", "User"],
  endpoints: (builder) => ({
    getMe: builder.query<SanitizedUserDto, void>({
      query: () => "/user/me",
      transformResponse: (response: GetMeApiResponse) => response.data.user,
      providesTags: ["Me"],
    }),

    getUserByUsername: builder.query<UserProfile, string>({
      query: (username) => `/user/profile/${username}`,
      // The response from the backend is now directly the data we need
      transformResponse: (response: { status: string; data: UserProfile }) =>
        response.data,
      providesTags: (result, error, username) => [
        { type: "User", id: username },
      ],
    }),

    followUser: builder.mutation<
      void,
      { userIdToFollow: string; usernameToInvalidate: string }
    >({
      query: ({ userIdToFollow }) => ({
        url: `/user/${userIdToFollow}/follow`,
        method: "POST",
      }),
      // Now invalidates the correct tag using the username
      invalidatesTags: (result, error, { usernameToInvalidate }) => [
        { type: "User", id: usernameToInvalidate },
      ],
    }),

    /**
     * --- FIX: Mutation now accepts username to correctly invalidate the cache ---
     */
    unfollowUser: builder.mutation<
      void,
      { userIdToUnfollow: string; usernameToInvalidate: string }
    >({
      query: ({ userIdToUnfollow }) => ({
        url: `/user/${userIdToUnfollow}/follow`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { usernameToInvalidate }) => [
        { type: "User", id: usernameToInvalidate },
      ],
    }),
    updateMyProfile: builder.mutation<UpdateProfileApiResponse, FormData>({
      queryFn: async (formData, api, _extraOptions) => {
        const { dispatch } = api;
        const file = (formData.get("profileImage") ||
          formData.get("bannerImage")) as File | null;
        const performUpload = (token: string) => {
          return new Promise<any>((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open(
              "PATCH",
              `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/user/me`
            );
            xhr.setRequestHeader("Authorization", `Bearer ${token}`);
            xhr.upload.onprogress = (event) => {
              if (event.lengthComputable) {
                const progress = Math.round((event.loaded * 100) / event.total);
                dispatch(uploadProgressUpdated(progress));
              }
            };
            xhr.onload = () => {
              const response = JSON.parse(xhr.responseText);
              if (xhr.status >= 200 && xhr.status < 300) {
                dispatch(uploadSucceeded());
                resolve(response);
              } else {
                dispatch(uploadFailed(response.message || "Upload failed"));
                reject({ status: xhr.status, data: response });
              }
            };
            xhr.onerror = () => {
              const errorMsg = "A network error occurred during upload.";
              dispatch(uploadFailed(errorMsg));
              reject({ status: "NETWORK_ERROR", data: { message: errorMsg } });
            };
            xhr.send(formData);
          });
        };
        try {
          dispatch(uploadStarted(file?.name || "file"));
          const session = await getSession();
          if (!session?.backendAccessToken) {
            throw new Error("Not authenticated.");
          }
          const result = await performUpload(session.backendAccessToken);
          return { data: result };
        } catch (error: any) {
          if (error.status === 401) {
            dispatch(
              uploadFailed("Your session has expired. Please reload the page.")
            );
          } else {
            dispatch(
              uploadFailed(error?.data?.message || "An unknown error occurred.")
            );
          }
          return { error: { status: error.status, data: error.data } };
        }
      },
      invalidatesTags: ["Me"],
    }),
    deleteMyAccount: builder.mutation<{ message: string }, void>({
      query: () => ({ url: "/user/me", method: "DELETE" }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(loggedOut());
        } catch (error) {
          dispatch(loggedOut());
        }
      },
    }),
  }),
});

export const {
  useGetMeQuery,
  useUpdateMyProfileMutation,
  useDeleteMyAccountMutation,
  useGetUserByUsernameQuery,
  useFollowUserMutation, // <-- Export new hook
  useUnfollowUserMutation, // <-- Export new hook
} = userApiSlice;
