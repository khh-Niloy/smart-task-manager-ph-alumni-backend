import { Router } from "express";
import { zodValidation } from "../../middleware/zodValidate";
import {
  teamZodSchema,
  teamUpdateZodSchema,
  teamMemberZodSchema,
  teamMemberUpdateZodSchema,
} from "./team.validation";
import { teamController } from "./team.controller";
import { roleBasedProtection } from "../../middleware/roleBasedProtection";

export const teamRoutes = Router();

teamRoutes.get(
  "/",
  roleBasedProtection(),
  teamController.getAllTeams
);

teamRoutes.post(
  "/",
  roleBasedProtection(),
  zodValidation(teamZodSchema),
  teamController.createTeam
);

teamRoutes.patch(
  "/:teamId",
  roleBasedProtection(),
  zodValidation(teamUpdateZodSchema),
  teamController.updateTeam
);

teamRoutes.delete(
  "/:teamId",
  roleBasedProtection(),
  teamController.deleteTeam
);

teamRoutes.post(
  "/members",
  roleBasedProtection(),
  zodValidation(teamMemberZodSchema),
  teamController.createTeamMember
);

teamRoutes.patch(
  "/members/:memberId",
  roleBasedProtection(),
  zodValidation(teamMemberUpdateZodSchema),
  teamController.updateTeamMember
);

teamRoutes.delete(
  "/members/:memberId",
  roleBasedProtection(),
  teamController.deleteTeamMember
);

