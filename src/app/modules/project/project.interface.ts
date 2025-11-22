import { Types } from "mongoose";

export enum TaskPriority {
  LOW = "Low",
  MEDIUM = "Medium",
  HIGH = "High",
}

export enum TaskStatus {
  PENDING = "Pending",
  IN_PROGRESS = "In Progress",
  DONE = "Done",
}

export interface ITask {
  _id?: string;
  title: string;
  description: string;
  assignedMember?: Types.ObjectId | string | "Unassigned";
  priority: TaskPriority;
  status: TaskStatus;
  project: Types.ObjectId | string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IProject {
  _id?: string;
  name: string;
  description?: string;
  team?: Types.ObjectId | string;
  tasks?: Types.ObjectId[] | string[];
  createdAt?: Date;
  updatedAt?: Date;
}

