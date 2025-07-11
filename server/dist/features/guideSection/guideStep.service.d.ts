import { GuideStep } from "../../../prisma/generated/prisma";
import { CreateGuideStepDto, UpdateGuideStepDto } from "./guideStep.types";
declare class GuideStepService {
    private verifyAuthorship;
    create(userId: string, postId: string, data: CreateGuideStepDto): Promise<GuideStep>;
    update(userId: string, stepId: string, data: UpdateGuideStepDto): Promise<GuideStep>;
    delete(userId: string, stepId: string): Promise<void>;
}
export declare const guideStepService: GuideStepService;
export {};
//# sourceMappingURL=guideStep.service.d.ts.map