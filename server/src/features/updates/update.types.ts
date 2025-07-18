// src/features/updates/update.types.ts
import { UpdateCategory } from "@/prisma-client";

export interface CreateUpdateDto {
  title: string;
  content: string;
  category: UpdateCategory;
  version?: string;
}

export interface UpdateUpdateDto extends Partial<CreateUpdateDto> {}
