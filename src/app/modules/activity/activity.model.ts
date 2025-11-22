import { model, Schema } from "mongoose";
import { IActivityLog, ActivityType } from "./activity.interface";

const activityLogSchema = new Schema<IActivityLog>(
  {
    type: {
      type: String,
      enum: Object.values(ActivityType),
      required: [true, "Activity type is required"],
    },
    description: {
      type: String,
      required: [true, "Activity description is required"],
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
    project: {
      type: Schema.Types.ObjectId,
      ref: "Project",
    },
    task: {
      type: Schema.Types.ObjectId,
      ref: "Task",
    },
    team: {
      type: Schema.Types.ObjectId,
      ref: "Team",
    },
    teamMember: {
      type: Schema.Types.ObjectId,
      ref: "TeamMember",
    },
    performedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

activityLogSchema.index({ project: 1, createdAt: -1 });
activityLogSchema.index({ task: 1, createdAt: -1 });
activityLogSchema.index({ type: 1, createdAt: -1 });

export const ActivityLog = model<IActivityLog>("ActivityLog", activityLogSchema);

