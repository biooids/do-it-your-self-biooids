// We now import the unified GuideSection type from Prisma
import { GuideSection } from "@/prisma-client";

// The DTO now represents a GuideSection
export type GuideSectionDto = GuideSection;

// DTO for creating a new guide section
export interface CreateGuideSectionDto {
  title: string;
  content: string;
  order: number;
  videoUrl?: string;
  // The optional image is handled via FormData, so it's not in the DTO
}

// DTO for updating an existing guide section
export type UpdateGuideSectionDto = Partial<CreateGuideSectionDto>;

// Standard API response shape
export interface GuideSectionApiResponse {
  status: string;
  message: string;
  data: GuideSectionDto;
}
