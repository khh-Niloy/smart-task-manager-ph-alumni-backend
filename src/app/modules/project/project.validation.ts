import { z } from "zod";

export const taskPriorityEnum = z.enum(["Low", "Medium", "High"]);

export const taskStatusEnum = z.enum(["Pending", "In Progress", "Done"]);

export const projectZodSchema = z.object({
  name: z
    .string({ message: "Project name must be a string" })
    .min(1, { message: "Project name must be at least 1 character long" })
    .max(100, { message: "Project name cannot exceed 100 characters" })
    .trim(),
  description: z
    .string({ message: "Project description must be a string" })
    .max(500, { message: "Project description cannot exceed 500 characters" })
    .trim()
    .optional(),
  team: z
    .string({ message: "Team ID must be a string" })
    .regex(/^[0-9a-fA-F]{24}$/, { message: "Invalid team ID format" })
    .optional(),
});

export const taskZodSchema = z.object({
  title: z
    .string({ message: "Task title must be a string" })
    .min(1, { message: "Task title must be at least 1 character long" })
    .max(200, { message: "Task title cannot exceed 200 characters" })
    .trim(),
  description: z
    .string({ message: "Task description must be a string" })
    .max(1000, { message: "Task description cannot exceed 1000 characters" })
    .trim()
    .optional(),
  assignedMember: z
    .union([
      z.string().regex(/^[0-9a-fA-F]{24}$/, { message: "Invalid user ID format" }),
      z.literal("Unassigned"),
    ])
    .optional(),
  priority: taskPriorityEnum.optional(),
  status: taskStatusEnum.optional(),
  project: z
    .string({ message: "Project ID must be a string" })
    .regex(/^[0-9a-fA-F]{24}$/, { message: "Invalid project ID format" }),
  autoAssign: z.boolean().optional(),
  forceAssign: z.boolean().optional(),
});

export const taskUpdateZodSchema = z.object({
  title: z
    .string({ message: "Task title must be a string" })
    .min(1, { message: "Task title must be at least 1 character long" })
    .max(200, { message: "Task title cannot exceed 200 characters" })
    .trim()
    .optional(),
  description: z
    .string({ message: "Task description must be a string" })
    .max(1000, { message: "Task description cannot exceed 1000 characters" })
    .trim()
    .optional(),
  assignedMember: z
    .union([
      z.string().regex(/^[0-9a-fA-F]{24}$/, { message: "Invalid user ID format" }),
      z.literal("Unassigned"),
    ])
    .optional(),
  priority: taskPriorityEnum.optional(),
  status: taskStatusEnum.optional(),
});

export const projectUpdateZodSchema = z.object({
  name: z
    .string({ message: "Project name must be a string" })
    .min(1, { message: "Project name must be at least 1 character long" })
    .max(100, { message: "Project name cannot exceed 100 characters" })
    .trim()
    .optional(),
  description: z
    .string({ message: "Project description must be a string" })
    .max(500, { message: "Project description cannot exceed 500 characters" })
    .trim()
    .optional(),
  team: z
    .string({ message: "Team ID must be a string" })
    .regex(/^[0-9a-fA-F]{24}$/, { message: "Invalid team ID format" })
    .optional(),
});

export const taskFilterZodSchema = z.object({
  project: z
    .string({ message: "Project ID must be a string" })
    .regex(/^[0-9a-fA-F]{24}$/, { message: "Invalid project ID format" })
    .optional(),
  assignedMember: z
    .union([
      z.string().regex(/^[0-9a-fA-F]{24}$/, { message: "Invalid user ID format" }),
      z.literal("Unassigned"),
    ])
    .optional(),
  priority: taskPriorityEnum.optional(),
  status: taskStatusEnum.optional(),
});

