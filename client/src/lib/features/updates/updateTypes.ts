// =================================================================
// FILE: src/lib/features/updates/update.types.ts
// =================================================================
export type UpdateCategoryEnum = "APP_UPDATE" | "MARKETING" | "COMMUNITY";

interface UpdateAuthor {
  name: string;
  profileImage: string | null;
}

export interface UpdateDto {
  id: string;
  version: string | null;
  title: string;
  category: UpdateCategoryEnum;
  content: string;
  publishedAt: string;
  author: UpdateAuthor;
}

// --- API Payloads and Responses ---
export interface GetUpdatesParams {
  skip?: number;
  take?: number;
}

export interface GetUpdatesResponse {
  success: boolean;
  data: UpdateDto[];
  total: number;
}

export interface GetUpdateResponse {
  success: boolean;
  data: UpdateDto;
}

export interface CreateUpdatePayload {
  title: string;
  content: string;
  category: UpdateCategoryEnum;
  version?: string;
}

export interface UpdateUpdatePayload extends Partial<CreateUpdatePayload> {
  id: string;
}
