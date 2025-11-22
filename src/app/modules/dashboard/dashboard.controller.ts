import { Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import { dashboardServices } from "./dashboard.service";

const getDashboard = async (req: Request, res: Response) => {
  try {
    const { userId } = (req.user as JwtPayload) || {};
    const dashboardData = await dashboardServices.getDashboardDataService(
      userId as string
    );
    res.status(200).json({
      success: true,
      message: "Dashboard data retrieved successfully",
      data: dashboardData,
    });
  } catch (error) {
    const errorMessage = (error as Error).message;
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: errorMessage,
    });
  }
};

export const dashboardController = {
  getDashboard,
};

