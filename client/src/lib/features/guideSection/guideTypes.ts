// =================================================================
// FILE: src/lib/features/guideSection/guideTypes.ts
// =================================================================
// The shape of a single Guide Section object received from the API
export interface GuideSectionDto {
  id: string;
  title: string | null;
  content: string;
  videoUrl: string | null;
  imageUrl: string | null;
  imagePublicId: string | null;
  order: number;
  stepId: string;
}

// The shape of a single Guide Step, which contains sections
export interface GuideStepDto {
  id: string;
  title: string;
  description: string | null;
  order: number;
  sections: GuideSectionDto[];
  // FIX: Make postId optional. It's required for some API calls,
  // but not present when nested inside a full PostDto.
  postId?: string;
}

// DTOs for creating and updating steps
export interface CreateGuideStepDto {
  title: string;
  description?: string;
  order: number;
}
export interface UpdateGuideStepDto extends Partial<CreateGuideStepDto> {}

// API Response Shapes
export interface GuideSectionApiResponse {
  success: boolean;
  data: GuideSectionDto;
}
export interface GuideStepApiResponse {
  success: boolean;
  data: GuideStepDto;
}
