import { ActivityLog } from "./activity.model";
import { IActivityLog, ActivityType } from "./activity.interface";
import { Types } from "mongoose";

const createActivityLogService = async (payload: Partial<IActivityLog>) => {
  const activityLog = await ActivityLog.create(payload);
  return activityLog;
};

const getActivityLogsService = async (filters: {
  project?: string;
  task?: string;
  team?: string;
  type?: ActivityType;
  limit?: number;
  page?: number;
}) => {
  const { project, task, team, type, limit = 50, page = 1 } = filters;

  const query: any = {};
  if (project) query.project = new Types.ObjectId(project);
  if (task) query.task = new Types.ObjectId(task);
  if (team) query.team = new Types.ObjectId(team);
  if (type) query.type = type;

  const skip = (page - 1) * limit;

  const [logs, total] = await Promise.all([
    ActivityLog.find(query)
      .populate("project", "name")
      .populate("task", "title")
      .populate("team", "name")
      .populate("teamMember", "name")
      .populate("performedBy", "name email")
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip),
    ActivityLog.countDocuments(query),
  ]);

  return {
    logs,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const activityServices = {
  createActivityLogService,
  getActivityLogsService,
};

