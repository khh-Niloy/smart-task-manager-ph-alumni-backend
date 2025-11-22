import { Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import { teamServices } from "./team.service";

const getAllTeams = async (req: Request, res: Response) => {
  try {
    const teams = await teamServices.getAllTeamsService();
    res.status(200).json({
      success: true,
      message: "Teams fetched successfully",
      data: teams,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: (error as Error).message,
    });
  }
};

const createTeam = async (req: Request, res: Response) => {
  try {
    const { userId } = (req.user as JwtPayload) || {};
    const newTeam = await teamServices.createTeamService({
      ...req.body,
      createdBy: userId,
    });
    res.status(201).json({
      success: true,
      message: "Team created successfully",
      data: newTeam,
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

const updateTeam = async (req: Request, res: Response) => {
  try {
    const { teamId } = req.params;
    const updatedTeam = await teamServices.updateTeamService(teamId, req.body);
    res.status(200).json({
      success: true,
      message: "Team updated successfully",
      data: updatedTeam,
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

const deleteTeam = async (req: Request, res: Response) => {
  try {
    const { teamId } = req.params;
    const result = await teamServices.deleteTeamService(teamId);
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

const createTeamMember = async (req: Request, res: Response) => {
  try {
    const newTeamMember = await teamServices.createTeamMemberService(req.body);
    res.status(201).json({
      success: true,
      message: "Team member created successfully",
      data: newTeamMember,
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

const updateTeamMember = async (req: Request, res: Response) => {
  try {
    const { memberId } = req.params;
    const updatedTeamMember = await teamServices.updateTeamMemberService(
      memberId,
      req.body
    );
    res.status(200).json({
      success: true,
      message: "Team member updated successfully",
      data: updatedTeamMember,
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

const deleteTeamMember = async (req: Request, res: Response) => {
  try {
    const { memberId } = req.params;
    const result = await teamServices.deleteTeamMemberService(memberId);
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

export const teamController = {
  getAllTeams,
  createTeam,
  updateTeam,
  deleteTeam,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
};

