// FILE: src/lib/schemas/opportunity.schemas.ts
import { z } from "zod";

const OpportunityTypeEnum = z.enum(
  ["FULL_TIME", "PART_TIME", "CONTRACT", "INTERNSHIP"],
  {
    required_error: "You must select an opportunity type.",
  }
);

// A simple regex to check for common image extensions
const IMAGE_URL_REGEX = /\.(jpg|jpeg|png|gif|webp|svg)$/i;

export const opportunitySchema = z.object({
  // ... other fields remain the same
  title: z
    .string()
    .min(3, "Title must be at least 3 characters long.")
    .max(100, "Title cannot exceed 100 characters."),
  companyName: z.string().min(1, "Company name is required."),
  location: z.string().min(1, "Location is required."),
  type: OpportunityTypeEnum,
  fullDescription: z
    .string()
    .min(20, "Full description must be at least 20 characters long."),
  applyUrl: z
    .string()
    .url({ message: "Please provide a valid URL for the application link." }),

  // --- THIS IS THE MODIFIED FIELD ---
  companyLogo: z
    .string()
    .url({ message: "Please provide a valid URL for the company logo." })
    // Add the refine check here
    .refine((url) => IMAGE_URL_REGEX.test(url), {
      message:
        "URL must end with a valid image extension (e.g., .jpg, .png, .gif).",
    })
    .optional()
    .or(z.literal("")),
  // ------------------------------------

  isRemote: z.boolean().optional().default(false),
  salaryRange: z.string().optional(),
  responsibilities: z.string().optional(),
  qualifications: z.string().optional(),
  tags: z.string().optional(),
});

export type OpportunityFormValues = z.infer<typeof opportunitySchema>;
