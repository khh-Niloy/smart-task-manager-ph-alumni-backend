import { Types } from "mongoose";

export enum ActivityType {
  TASK_CREATED = "TASK_CREATED",
  TASK_UPDATED = "TASK_UPDATED",
  TASK_DELETED = "TASK_DELETED",
  TASK_REASSIGNED = "TASK_REASSIGNED",
  TASK_AUTO_REASSIGNED = "TASK_AUTO_REASSIGNED",
  PROJECT_CREATED = "PROJECT_CREATED",
  PROJECT_UPDATED = "PROJECT_UPDATED",
  PROJECT_DELETED = "PROJECT_DELETED",
  TEAM_CREATED = "TEAM_CREATED",
  TEAM_UPDATED = "TEAM_UPDATED",
  TEAM_DELETED = "TEAM_DELETED",
  MEMBER_ADDED = "MEMBER_ADDED",
  MEMBER_REMOVED = "MEMBER_REMOVED",
}

export interface IActivityLog {
  _id?: string;
  type: ActivityType;
  description: string;
  project?: Types.ObjectId | string;
  task?: Types.ObjectId | string;
  team?: Types.ObjectId | string;
  teamMember?: Types.ObjectId | string;
  performedBy?: Types.ObjectId | string;
  metadata?: Record<string, any>;
  createdAt?: Date;
  updatedAt?: Date;
}

