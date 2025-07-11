// src/features/updates/update.service.ts
import prisma from "@/db/prisma";
import { SystemRole } from "@/prisma-client";
import { createHttpError } from "@/utils/error.factory";
import { CreateUpdateDto, UpdateUpdateDto } from "./update.types";

class UpdateService {
  public async create(data: CreateUpdateDto, authorId: string) {
    const newUpdate = await prisma.update.create({
      data: {
        ...data,
        author: { connect: { id: authorId } },
      },
      include: { author: { select: { name: true, profileImage: true } } },
    });
    return newUpdate;
  }

  public async findAll(pagination: { skip: number; take: number }) {
    const { skip, take } = pagination;
    const [updates, total] = await prisma.$transaction([
      prisma.update.findMany({
        skip,
        take,
        orderBy: { publishedAt: "desc" },
        include: { author: { select: { name: true, profileImage: true } } },
      }),
      prisma.update.count(),
    ]);
    return { updates, total };
  }

  public async findOne(id: string) {
    const update = await prisma.update.findUnique({
      where: { id },
      include: { author: { select: { name: true, profileImage: true } } },
    });
    if (!update) throw createHttpError(404, "Update not found.");
    return update;
  }

  public async update(
    id: string,
    data: UpdateUpdateDto,
    userId: string,
    userRole: SystemRole
  ) {
    const updateToModify = await this.findOne(id);
    // This logic is correct: only the author or a SUPER_ADMIN can modify.
    if (updateToModify.authorId !== userId && userRole !== "SUPER_ADMIN") {
      throw createHttpError(
        403,
        "You are not authorized to modify this update."
      );
    }
    const updated = await prisma.update.update({
      where: { id },
      data,
      include: { author: { select: { name: true, profileImage: true } } },
    });
    return updated;
  }

  public async remove(id: string, userId: string, userRole: SystemRole) {
    const updateToModify = await this.findOne(id);
    // This logic is correct.
    if (updateToModify.authorId !== userId && userRole !== "SUPER_ADMIN") {
      throw createHttpError(
        403,
        "You are not authorized to delete this update."
      );
    }
    await prisma.update.delete({ where: { id } });
  }
}

export const updateService = new UpdateService();
