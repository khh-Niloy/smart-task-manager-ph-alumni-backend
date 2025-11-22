import { Router } from "express";
import { activityController } from "./activity.controller";
import { roleBasedProtection } from "../../middleware/roleBasedProtection";

export const activityRoutes = Router();

activityRoutes.get(
  "/",
  roleBasedProtection(),
  activityController.getActivityLogs
);

