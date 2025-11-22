import { model, Schema, Types } from "mongoose";
import { IProject, ITask, TaskPriority, TaskStatus } from "./project.interface";

const taskSchema = new Schema<ITask>(
  {
    title: {
      type: String,
      required: [true, "Task title is required"],
      trim: true,
      minlength: [1, "Task title must be at least 1 character long"],
      maxlength: [200, "Task title cannot exceed 200 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, "Task description cannot exceed 1000 characters"],
    },
    assignedMember: {
      type: Schema.Types.Mixed,
      default: "Unassigned",
      validate: {
        validator: function (value: any) {
          if (value === "Unassigned") return true;
          if (typeof value === "string") {
            return /^[0-9a-fA-F]{24}$/.test(value);
          }
          return Types.ObjectId.isValid(value);
        },
        message: 'assignedMember must be either "Unassigned" or a valid ObjectId',
      },
    },
    priority: {
      type: String,
      enum: Object.values(TaskPriority),
      required: [true, "Task priority is required"],
      default: TaskPriority.MEDIUM,
    },
    status: {
      type: String,
      enum: Object.values(TaskStatus),
      required: [true, "Task status is required"],
      default: TaskStatus.PENDING,
    },
    project: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: [true, "Project reference is required"],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const projectSchema = new Schema<IProject>(
  {
    name: {
      type: String,
      required: [true, "Project name is required"],
      trim: true,
      minlength: [1, "Project name must be at least 1 character long"],
      maxlength: [100, "Project name cannot exceed 100 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, "Project description cannot exceed 500 characters"],
    },
    team: {
      type: Schema.Types.ObjectId,
      ref: "Team",
    },
    tasks: [
      {
        type: Schema.Types.ObjectId,
        ref: "Task",
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const Task = model<ITask>("Task", taskSchema);
export const Project = model<IProject>("Project", projectSchema);

