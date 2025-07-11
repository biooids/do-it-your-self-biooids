import { GuideSection } from "../../../prisma/generated/prisma";
import { CreateGuideSectionDto, UpdateGuideSectionDto } from "./guideSection.types.js";
declare class GuideSectionService {
    private verifyAuthorshipBySection;
    private verifyAuthorshipByStep;
    create(userId: string, stepId: string, data: CreateGuideSectionDto, imageFile?: Express.Multer.File): Promise<GuideSection>;
    update(userId: string, sectionId: string, data: UpdateGuideSectionDto, imageFile?: Express.Multer.File): Promise<GuideSection>;
    delete(userId: string, sectionId: string): Promise<void>;
}
export declare const guideSectionService: GuideSectionService;
export {};
//# sourceMappingURL=guideSection.service.d.ts.map