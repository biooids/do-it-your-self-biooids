import { GuideStep } from "@/prisma-client";
export type GuideStepDto = GuideStep;
export interface CreateGuideStepDto {
  title: string;
  description?: string;
  order: number;
}
export type UpdateGuideStepDto = Partial<CreateGuideStepDto>;
