import { model, Schema } from "mongoose";
import { ITeam, ITeamMember } from "./team.interface";

const teamMemberSchema = new Schema<ITeamMember>(
  {
    name: {
      type: String,
      required: [true, "Team member name is required"],
      trim: true,
      minlength: [1, "Team member name must be at least 1 character long"],
      maxlength: [100, "Team member name cannot exceed 100 characters"],
    },
    role: {
      type: String,
      required: [true, "Team member role is required"],
      trim: true,
      minlength: [1, "Team member role must be at least 1 character long"],
      maxlength: [100, "Team member role cannot exceed 100 characters"],
    },
    capacity: {
      type: Number,
      required: [true, "Team member capacity is required"],
      min: [0, "Capacity must be at least 0"],
      max: [5, "Capacity cannot exceed 5"],
      validate: {
        validator: Number.isInteger,
        message: "Capacity must be an integer",
      },
    },
    team: {
      type: Schema.Types.ObjectId,
      ref: "Team",
      required: [true, "Team reference is required"],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const teamSchema = new Schema<ITeam>(
  {
    name: {
      type: String,
      required: [true, "Team name is required"],
      trim: true,
      minlength: [1, "Team name must be at least 1 character long"],
      maxlength: [100, "Team name cannot exceed 100 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, "Team description cannot exceed 500 characters"],
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Creator reference is required"],
    },
    members: [
      {
        type: Schema.Types.ObjectId,
        ref: "TeamMember",
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const TeamMember = model<ITeamMember>("TeamMember", teamMemberSchema);
export const Team = model<ITeam>("Team", teamSchema);

