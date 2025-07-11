// =================================================================
// FILE: src/lib/features/projectUpdate/projectUpdateTypes.ts (NEW FILE)
// =================================================================
export enum ProjectUpdateCategory {
  FEATURE = "FEATURE",
  BUG_FIX = "BUG_FIX",
  REFACTOR = "REFACTOR",
  DEPLOYMENT = "DEPLOYMENT",
  DOCUMENTATION = "DOCUMENTATION",
  CHORE = "CHORE",
  OTHER = "OTHER",
}

// FIX: Export the array of enum values for use in UI components
export const projectUpdateCategories = [
  "FEATURE",
  "BUG_FIX",
  "REFACTOR",
  "DEPLOYMENT",
  "DOCUMENTATION",
  "CHORE",
  "OTHER",
] as const;

export interface ProjectUpdateDto {
  id: string;
  version: string;
  date: string; // ISO date string
  title: string;
  description: string;
  category: ProjectUpdateCategory;
  imageUrl: string | null;
  imagePublicId: string | null;
  createdAt: string;
  postId: string;
}

export interface ProjectUpdateApiResponse {
  status: string;
  message: string;
  data: ProjectUpdateDto;
}
