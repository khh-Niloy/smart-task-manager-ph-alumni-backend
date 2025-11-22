import { Types } from "mongoose";

export interface ITeamMember {
  _id?: string;
  name: string;
  role: string;
  capacity: number;
  team: Types.ObjectId | string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ITeam {
  _id?: string;
  name: string;
  description?: string;
  createdBy: Types.ObjectId | string;
  members?: Types.ObjectId[] | string[];
  createdAt?: Date;
  updatedAt?: Date;
}

