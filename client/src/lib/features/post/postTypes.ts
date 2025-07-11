// =================================================================
// FILE: src/lib/features/post/postTypes.ts (UPDATED FILE)
// =================================================================
import { SanitizedUserDto } from "../user/userTypes";
import { GuideStepDto } from "../guideSection/guideTypes";
import { ProjectUpdateDto } from "../projectUpdate/projectUpdateTypes";

export type PostCategory =
  | "PROJECT"
  | "BLOG"
  | "RESOURCE"
  | "ARTICLE"
  | "SHOWCASE"
  | "DISCUSSION"
  | "GUIDE";

export type SharePlatform =
  | "TWITTER"
  | "FACEBOOK"
  | "LINKEDIN"
  | "EMAIL"
  | "WHATSAPP"
  | "REDDIT"
  | "LINK_COPIED"
  | "INTERNAL_MESSAGE"
  | "OTHER";

export interface PostsState {
  posts: PostDto[];
}

interface PostTag {
  tag: { id: string; name: string };
}

// FIX: Renamed to PostImageDto and exported
export interface PostImageDto {
  id: string;
  url: string;
  publicId: string;
  altText: string | null;
  order: number;
}

export interface PostDto {
  id: string;
  title: string;
  description: string;
  content: string;
  category: PostCategory;
  createdAt: string;
  updatedAt: string;
  externalLink: string | null;
  githubLink: string | null;
  likesCount: number;
  viewsCount: number;
  savedCount: number;
  sharesCount: number;
  commentsCount: number;
  authorId: string;
  author: Pick<SanitizedUserDto, "id" | "name" | "username" | "profileImage">;
  tags: PostTag[];
  images: PostImageDto[]; // Use the exported type
  projectJourney: ProjectUpdateDto[];
  steps: GuideStepDto[];
  isLikedByCurrentUser: boolean;
  isSavedByCurrentUser: boolean;
}

export interface GetPostsArgs {
  limit?: number;
  page?: number;
  category?: PostCategory;
  q?: string;
  tags?: string;
  sort?: "newest" | "oldest" | "title-asc" | "title-desc";
  authorId?: string;
  likedByUserId?: string;
  savedByUserId?: string;
}

export interface PaginationInfo {
  totalItems: number;
  totalPages: number;
  currentPage: number;
}

export interface GetPostsApiResponse {
  status: string;
  results: number;
  data: PostDto[];
  pagination: PaginationInfo;
}

export interface GetPostApiResponse {
  status: string;
  data: PostDto;
}

export interface CreatePostApiResponse {
  status: string;
  message: string;
  data: PostDto;
}

export interface UpdatePostApiResponse extends CreatePostApiResponse {}

export interface GetTagsApiResponse {
  status: string;
  data: { name: string }[];
}

export interface GetTagsArgs {
  category?: PostCategory;
  likedByUserId?: string; // <-- Add this
  savedByUserId?: string; //
}

export interface LikePostApiResponse {
  status: string;
  message: string;
  data: { likesCount: number };
}

export interface SavePostApiResponse {
  status: string;
  message: string;
  data: { savedCount: number };
}

export interface SharePostApiRequest {
  postId: string;
  platform: SharePlatform;
}

export interface SharePostApiResponse {
  status: string;
  message: string;
  data: { sharesCount: number };
}

// =================================================================
// FILE: src/lib/features/upload/uploadProgressSlice.ts (NEW FILE)
// =================================================================
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UploadProgressState {
  isUploading: boolean;
  progress: number;
  error: string | null;
  fileName: string | null;
}

const initialState: UploadProgressState = {
  isUploading: false,
  progress: 0,
  error: null,
  fileName: null,
};

const uploadProgressSlice = createSlice({
  name: "uploadProgress",
  initialState,
  reducers: {
    uploadStarted(state, action: PayloadAction<string>) {
      state.isUploading = true;
      state.progress = 0;
      state.error = null;
      state.fileName = action.payload;
    },
    uploadProgressUpdated(state, action: PayloadAction<number>) {
      state.progress = action.payload;
    },
    uploadSucceeded(state) {
      state.isUploading = false;
      state.progress = 100;
      state.fileName = null;
    },
    uploadFailed(state, action: PayloadAction<string>) {
      state.isUploading = false;
      state.error = action.payload;
      state.fileName = null;
    },
    resetUploadState(state) {
      state.isUploading = false;
      state.progress = 0;
      state.error = null;
      state.fileName = null;
    },
  },
});

export const {
  uploadStarted,
  uploadProgressUpdated,
  uploadSucceeded,
  uploadFailed,
  resetUploadState,
} = uploadProgressSlice.actions;

export default uploadProgressSlice.reducer;
