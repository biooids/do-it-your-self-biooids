import { GuideSection } from "../../../prisma/generated/prisma";
export type GuideSectionDto = GuideSection;
export interface CreateGuideSectionDto {
    title: string;
    content: string;
    order: number;
    videoUrl?: string;
}
export type UpdateGuideSectionDto = Partial<CreateGuideSectionDto>;
export interface GuideSectionApiResponse {
    status: string;
    message: string;
    data: GuideSectionDto;
}
//# sourceMappingURL=guideSection.types.d.ts.map