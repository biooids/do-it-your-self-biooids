import prisma from "@/db/prisma.js";
import { Prisma, GuideSection } from "../../../prisma/generated/prisma";
import { createHttpError } from "@/utils/error.factory.js";
import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "@/config/cloudinary.js";
import {
  CreateGuideSectionDto,
  UpdateGuideSectionDto,
} from "./guideSection.types.js";

class GuideSectionService {
  /**
   * Security check to ensure user is the author of the parent guide.
   * It now checks ownership by going from the section -> step -> post -> author.
   */
  private async verifyAuthorshipBySection(userId: string, sectionId: string) {
    const section = await prisma.guideSection.findUnique({
      where: { id: sectionId },
      // Traverse up the relations to get the original author's ID
      include: { step: { include: { post: { select: { authorId: true } } } } },
    });
    if (!section || section.step.post.authorId !== userId) {
      throw createHttpError(
        403,
        "You are not authorized to modify this section."
      );
    }
    return section; // Return the fetched section to avoid a second DB call
  }

  /**
   * Security check for creating a new section.
   * Checks ownership via the parent stepId.
   */
  private async verifyAuthorshipByStep(userId: string, stepId: string) {
    const step = await prisma.guideStep.findUnique({
      where: { id: stepId },
      include: { post: { select: { authorId: true } } },
    });
    if (!step || step.post.authorId !== userId) {
      throw createHttpError(
        403,
        "You are not authorized to add a section to this step."
      );
    }
  }

  /**
   * Create a new guide section.
   * It now accepts a stepId instead of a postId.
   */
  async create(
    userId: string,
    stepId: string, // <-- CHANGED from postId
    data: CreateGuideSectionDto,
    imageFile?: Express.Multer.File
  ): Promise<GuideSection> {
    // Use the new security check
    await this.verifyAuthorshipByStep(userId, stepId);

    const createData: Prisma.GuideSectionCreateInput = {
      ...data,
      order: Number(data.order),
      // Connect to a step, NOT a post
      step: { connect: { id: stepId } },
    };

    if (imageFile) {
      const result = await uploadToCloudinary(imageFile.path, "guide_sections");
      createData.imageUrl = result.secure_url;
      createData.imagePublicId = result.public_id;
    }

    return prisma.guideSection.create({ data: createData });
  }

  /**
   * Update an existing guide section.
   */
  async update(
    userId: string,
    sectionId: string,
    data: UpdateGuideSectionDto,
    imageFile?: Express.Multer.File
  ): Promise<GuideSection> {
    const guideSection = await this.verifyAuthorshipBySection(
      userId,
      sectionId
    );

    const updateData: Prisma.GuideSectionUpdateInput = { ...data };
    if (data.order) {
      updateData.order = Number(data.order);
    }

    if (imageFile) {
      if (guideSection.imagePublicId) {
        await deleteFromCloudinary(guideSection.imagePublicId);
      }
      const result = await uploadToCloudinary(imageFile.path, "guide_sections");
      updateData.imageUrl = result.secure_url;
      updateData.imagePublicId = result.public_id;
    }

    return prisma.guideSection.update({
      where: { id: sectionId },
      data: updateData,
    });
  }

  /**
   * Delete a guide section.
   */
  async delete(userId: string, sectionId: string): Promise<void> {
    const guideSection = await this.verifyAuthorshipBySection(
      userId,
      sectionId
    );

    if (guideSection.imagePublicId) {
      await deleteFromCloudinary(guideSection.imagePublicId);
    }

    await prisma.guideSection.delete({ where: { id: sectionId } });
  }
}

export const guideSectionService = new GuideSectionService();
