import { Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import { projectServices } from "./project.service";

const getProjects = async (req: Request, res: Response) => {
  try {
    const projects = await projectServices.getProjectsService();
    res.status(200).json({
      success: true,
      message: "Projects retrieved successfully",
      data: projects,
    });
  } catch (error) {
    const errorMessage = (error as Error).message;
    res.status(400).json({
      success: false,
      message: errorMessage,
    });
  }
};

const createProject = async (req: Request, res: Response) => {
  try {
    const newProject = await projectServices.createProjectService(req.body);
    res.status(201).json({
      success: true,
      message: "Project created successfully",
      data: newProject,
    });
  } catch (error) {
    const errorMessage = (error as Error).message;
    const statusCode = errorMessage.includes("not found") ? 404 : 400;
    res.status(statusCode).json({
      success: false,
      message: errorMessage,
    });
  }
};

const updateProject = async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params;
    const updatedProject = await projectServices.updateProjectService(
      projectId,
      req.body
    );
    res.status(200).json({
      success: true,
      message: "Project updated successfully",
      data: updatedProject,
    });
  } catch (error) {
    const errorMessage = (error as Error).message;
    const statusCode = errorMessage.includes("not found") ? 404 : 400;
    res.status(statusCode).json({
      success: false,
      message: errorMessage,
    });
  }
};

const deleteProject = async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params;
    const result = await projectServices.deleteProjectService(projectId);
    res.status(200).json({
      success: true,
      message: result.message,
      data: null,
    });
  } catch (error) {
    const errorMessage = (error as Error).message;
    const statusCode = errorMessage.includes("not found") ? 404 : 400;
    res.status(statusCode).json({
      success: false,
      message: errorMessage,
    });
  }
};

const getTeamMembersWithLoad = async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params;
    const result = await projectServices.getTeamMembersWithLoadService(projectId);
    res.status(200).json({
      success: true,
      message: "Team members with load retrieved successfully",
      data: result,
    });
  } catch (error) {
    const errorMessage = (error as Error).message;
    const statusCode = errorMessage.includes("not found") ? 404 : 400;
    res.status(statusCode).json({
      success: false,
      message: errorMessage,
    });
  }
};

const createTask = async (req: Request, res: Response) => {
  try {
    const { autoAssign, forceAssign, ...taskData } = req.body;
    const result = await projectServices.createTaskService(taskData, {
      autoAssign,
      forceAssign,
    });

    const response: any = {
      success: true,
      message: "Task created successfully",
      data: result.task,
    };

    // Include capacity warning if present
    if (result.capacityWarning) {
      response.warning = result.capacityWarning;
    }

    res.status(201).json(response);
  } catch (error) {
    const errorMessage = (error as Error).message;

    // Handle capacity warning
    if (errorMessage.startsWith("CAPACITY_WARNING:")) {
      const warningData = JSON.parse(
        errorMessage.replace("CAPACITY_WARNING:", "")
      );
      return res.status(400).json({
        success: false,
        message: "Member is over capacity",
        warning: warningData,
        requiresConfirmation: true,
      });
    }

    const statusCode = errorMessage.includes("not found") ? 404 : 400;
    res.status(statusCode).json({
      success: false,
      message: errorMessage,
    });
  }
};

const updateTask = async (req: Request, res: Response) => {
  try {
    const { taskId } = req.params;
    const updatedTask = await projectServices.updateTaskService(
      taskId,
      req.body
    );
    res.status(200).json({
      success: true,
      message: "Task updated successfully",
      data: updatedTask,
    });
  } catch (error) {
    const errorMessage = (error as Error).message;
    const statusCode = errorMessage.includes("not found") ? 404 : 400;
    res.status(statusCode).json({
      success: false,
      message: errorMessage,
    });
  }
};

const deleteTask = async (req: Request, res: Response) => {
  try {
    const { taskId } = req.params;
    const result = await projectServices.deleteTaskService(taskId);
    res.status(200).json({
      success: true,
      message: result.message,
      data: null,
    });
  } catch (error) {
    const errorMessage = (error as Error).message;
    const statusCode = errorMessage.includes("not found") ? 404 : 400;
    res.status(statusCode).json({
      success: false,
      message: errorMessage,
    });
  }
};

const autoReassignTasks = async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params;
    const { userId } = (req.user as JwtPayload) || {};
    const result = await projectServices.autoReassignTasksService(
      projectId,
      userId as string
    );
    res.status(200).json({
      success: true,
      message: result.message,
      data: result.reassignments,
    });
  } catch (error) {
    const errorMessage = (error as Error).message;
    const statusCode = errorMessage.includes("not found") ? 404 : 400;
    res.status(statusCode).json({
      success: false,
      message: errorMessage,
    });
  }
};

export const projectController = {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
  getTeamMembersWithLoad,
  createTask,
  updateTask,
  deleteTask,
  autoReassignTasks,
};

