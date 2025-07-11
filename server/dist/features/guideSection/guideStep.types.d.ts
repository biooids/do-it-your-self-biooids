import { GuideStep } from "../../../prisma/generated/prisma";
export type GuideStepDto = GuideStep;
export interface CreateGuideStepDto {
    title: string;
    description?: string;
    order: number;
}
export type UpdateGuideStepDto = Partial<CreateGuideStepDto>;
//# sourceMappingURL=guideStep.types.d.ts.map