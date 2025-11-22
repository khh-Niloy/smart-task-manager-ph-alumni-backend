import { Router } from "express";
import { zodValidation } from "../../middleware/zodValidate";
import { userZodSchema } from "./user.validation";
import { userController } from "./user.controller";
import { roleBasedProtection } from "../../middleware/roleBasedProtection";

export const userRoutes = Router();

userRoutes.post(
  "/register",
  zodValidation(userZodSchema),
  userController.createUser
);

userRoutes.get(
  "/me",
  roleBasedProtection(),
  userController.getUser
);

userRoutes.patch(
  "/me",
  roleBasedProtection(),
  zodValidation(userZodSchema),
  userController.updateUser
);
