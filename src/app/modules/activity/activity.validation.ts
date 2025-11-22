import { z } from "zod";
import { ActivityType } from "./activity.interface";

// Activity Log Filter Schema
export const activityLogFilterZodSchema = z.object({
  project: z
    .string({ message: "Project ID must be a string" })
    .regex(/^[0-9a-fA-F]{24}$/, { message: "Invalid project ID format" })
    .optional(),
  task: z
    .string({ message: "Task ID must be a string" })
    .regex(/^[0-9a-fA-F]{24}$/, { message: "Invalid task ID format" })
    .optional(),
  team: z
    .string({ message: "Team ID must be a string" })
    .regex(/^[0-9a-fA-F]{24}$/, { message: "Invalid team ID format" })
    .optional(),
  type: z.nativeEnum(ActivityType).optional(),
  limit: z
    .union([z.string(), z.number()])
    .transform((val) => (typeof val === "string" ? parseInt(val, 10) : val))
    .pipe(
      z
        .number({ message: "Limit must be a number" })
        .int({ message: "Limit must be an integer" })
        .min(1, { message: "Limit must be at least 1" })
        .max(100, { message: "Limit cannot exceed 100" })
    )
    .optional(),
  page: z
    .union([z.string(), z.number()])
    .transform((val) => (typeof val === "string" ? parseInt(val, 10) : val))
    .pipe(
      z
        .number({ message: "Page must be a number" })
        .int({ message: "Page must be an integer" })
        .min(1, { message: "Page must be at least 1" })
    )
    .optional(),
});

