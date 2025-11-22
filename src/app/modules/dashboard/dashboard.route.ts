import { Router } from "express";
import { dashboardController } from "./dashboard.controller";
import { roleBasedProtection } from "../../middleware/roleBasedProtection";

export const dashboardRoutes = Router();

dashboardRoutes.get(
  "/",
  roleBasedProtection(),
  dashboardController.getDashboard
);

