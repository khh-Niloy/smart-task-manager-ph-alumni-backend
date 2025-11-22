import { Router } from "express";
import { zodValidation } from "../../middleware/zodValidate";
import {
  projectZodSchema,
  projectUpdateZodSchema,
  taskZodSchema,
  taskUpdateZodSchema,
} from "./project.validation";
import { projectController } from "./project.controller";
import { roleBasedProtection } from "../../middleware/roleBasedProtection";

export const projectRoutes = Router();

// Project Routes
projectRoutes.get(
  "/",
  roleBasedProtection(),
  projectController.getProjects
);

projectRoutes.post(
  "/",
  roleBasedProtection(),
  zodValidation(projectZodSchema),
  projectController.createProject
);

// Specific routes before generic :projectId routes
projectRoutes.get(
  "/:projectId/team-members",
  roleBasedProtection(),
  projectController.getTeamMembersWithLoad
);

projectRoutes.patch(
  "/:projectId",
  roleBasedProtection(),
  zodValidation(projectUpdateZodSchema),
  projectController.updateProject
);

projectRoutes.delete(
  "/:projectId",
  roleBasedProtection(),
  projectController.deleteProject
);

// Task Routes

projectRoutes.post(
  "/tasks",
  roleBasedProtection(),
  zodValidation(taskZodSchema),
  projectController.createTask
);

projectRoutes.patch(
  "/tasks/:taskId",
  roleBasedProtection(),
  zodValidation(taskUpdateZodSchema),
  projectController.updateTask
);

projectRoutes.delete(
  "/tasks/:taskId",
  roleBasedProtection(),
  projectController.deleteTask
);

projectRoutes.post(
  "/:projectId/reassign-tasks",
  roleBasedProtection(),
  projectController.autoReassignTasks
);

