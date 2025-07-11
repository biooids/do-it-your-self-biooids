import { UpdateCategory } from "../../../prisma/generated/prisma";
export interface CreateUpdateDto {
    title: string;
    content: string;
    category: UpdateCategory;
    version?: string;
}
export interface UpdateUpdateDto extends Partial<CreateUpdateDto> {
}
//# sourceMappingURL=update.types.d.ts.map