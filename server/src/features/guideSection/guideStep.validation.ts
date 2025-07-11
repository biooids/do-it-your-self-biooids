import { z } from "zod";
export const createGuideStepSchema = z.object({
  body: z.object({
    title: z.string().min(3),
    description: z.string().optional(),
    order: z.coerce.number().int().positive(),
  }),
});
export const updateGuideStepSchema = z.object({
  body: z.object({
    title: z.string().min(3).optional(),
    description: z.string().optional(),
    order: z.coerce.number().int().positive().optional(),
  }),
});
