import { z } from "zod";

export const teamZodSchema = z.object({
  name: z
    .string({ message: "Team name must be a string" })
    .min(1, { message: "Team name must be at least 1 character long" })
    .max(100, { message: "Team name cannot exceed 100 characters" })
    .trim(),
  description: z
    .string({ message: "Team description must be a string" })
    .max(500, { message: "Team description cannot exceed 500 characters" })
    .trim()
    .optional(),
});

export const teamUpdateZodSchema = z.object({
  name: z
    .string({ message: "Team name must be a string" })
    .min(1, { message: "Team name must be at least 1 character long" })
    .max(100, { message: "Team name cannot exceed 100 characters" })
    .trim()
    .optional(),
  description: z
    .string({ message: "Team description must be a string" })
    .max(500, { message: "Team description cannot exceed 500 characters" })
    .trim()
    .optional(),
});

export const teamMemberZodSchema = z.object({
  name: z
    .string({ message: "Team member name must be a string" })
    .min(1, { message: "Team member name must be at least 1 character long" })
    .max(100, { message: "Team member name cannot exceed 100 characters" })
    .trim(),
  role: z
    .string({ message: "Team member role must be a string" })
    .min(1, { message: "Team member role must be at least 1 character long" })
    .max(100, { message: "Team member role cannot exceed 100 characters" })
    .trim(),
  capacity: z
    .number({ message: "Capacity must be a number" })
    .int({ message: "Capacity must be an integer" })
    .min(0, { message: "Capacity must be at least 0" })
    .max(5, { message: "Capacity cannot exceed 5" }),
  team: z
    .string({ message: "Team ID must be a string" })
    .regex(/^[0-9a-fA-F]{24}$/, { message: "Invalid team ID format" }),
});

export const teamMemberUpdateZodSchema = z.object({
  name: z
    .string({ message: "Team member name must be a string" })
    .min(1, { message: "Team member name must be at least 1 character long" })
    .max(100, { message: "Team member name cannot exceed 100 characters" })
    .trim()
    .optional(),
  role: z
    .string({ message: "Team member role must be a string" })
    .min(1, { message: "Team member role must be at least 1 character long" })
    .max(100, { message: "Team member role cannot exceed 100 characters" })
    .trim()
    .optional(),
  capacity: z
    .number({ message: "Capacity must be a number" })
    .int({ message: "Capacity must be an integer" })
    .min(0, { message: "Capacity must be at least 0" })
    .max(5, { message: "Capacity cannot exceed 5" })
    .optional(),
});

