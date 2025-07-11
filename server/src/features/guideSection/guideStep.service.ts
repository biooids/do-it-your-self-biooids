import prisma from "@/db/prisma.js";
import { GuideStep } from "../../../prisma/generated/prisma";
import { createHttpError } from "@/utils/error.factory.js";
import { CreateGuideStepDto, UpdateGuideStepDto } from "./guideStep.types";

class GuideStepService {
  private async verifyAuthorship(userId: string, postId: string) {
    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post || post.authorId !== userId) {
      throw createHttpError(403, "Not authorized to modify this guide.");
    }
  }

  async create(
    userId: string,
    postId: string,
    data: CreateGuideStepDto
  ): Promise<GuideStep> {
    await this.verifyAuthorship(userId, postId);
    return prisma.guideStep.create({
      data: {
        ...data,
        order: Number(data.order),
        post: { connect: { id: postId } },
      },
    });
  }

  async update(
    userId: string,
    stepId: string,
    data: UpdateGuideStepDto
  ): Promise<GuideStep> {
    const step = await prisma.guideStep.findUnique({
      where: { id: stepId },
      include: { post: { select: { authorId: true } } },
    });
    if (!step || step.post.authorId !== userId) {
      throw createHttpError(403, "Not authorized to edit this step.");
    }
    const updateData = data.order
      ? { ...data, order: Number(data.order) }
      : data;
    return prisma.guideStep.update({ where: { id: stepId }, data: updateData });
  }

  async delete(userId: string, stepId: string): Promise<void> {
    const step = await prisma.guideStep.findUnique({
      where: { id: stepId },
      include: { post: { select: { authorId: true } } },
    });
    if (!step || step.post.authorId !== userId) {
      throw createHttpError(403, "Not authorized to delete this step.");
    }
    await prisma.guideStep.delete({ where: { id: stepId } });
  }
}
export const guideStepService = new GuideStepService();
