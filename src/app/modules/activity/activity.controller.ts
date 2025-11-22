import { Request, Response } from "express";
import { activityServices } from "./activity.service";
import { activityLogFilterZodSchema } from "./activity.validation";

const getActivityLogs = async (req: Request, res: Response) => {
  try {
    // Validate query parameters
    const validatedQuery = activityLogFilterZodSchema.parse({
      project: req.query.project,
      task: req.query.task,
      team: req.query.team,
      type: req.query.type,
      limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
      page: req.query.page ? parseInt(req.query.page as string) : undefined,
    });

    const result = await activityServices.getActivityLogsService(validatedQuery);
    res.status(200).json({
      success: true,
      message: "Activity logs retrieved successfully",
      data: result.logs,
      pagination: result.pagination,
    });
  } catch (error) {
    const errorMessage = (error as Error).message;
    res.status(400).json({
      success: false,
      message: errorMessage,
    });
  }
};

export const activityController = {
  getActivityLogs,
};

