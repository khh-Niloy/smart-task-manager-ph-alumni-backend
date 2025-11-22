import { Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import { userServices } from "./user.service";
import { cookiesService } from "../../utils/cookiesService";

const createUser = async (req: Request, res: Response) => {
  try {
    console.log(req.body);
    const { newCreatedUser, accessToken, refreshToken } =
      await userServices.createUserService(req.body);

    cookiesService.setCookie(res, accessToken, refreshToken);

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: newCreatedUser,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err,
    });
  }
};

const getUser = async (req: Request, res: Response) => {
  try {
    const { userId } = (req.user as JwtPayload) || {};
    const user = await userServices.getUserService(userId as string);
    res.status(200).json({
      success: true,
      message: "User fetched successfully",
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error,
    });
  }
};

const updateUser = async (req: Request, res: Response) => {
  try {
    const { userId } = (req.user as JwtPayload) || {};
    const updatedUser = await userServices.updateUserService(
      userId as string,
      req.body
    );
    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    const errorMessage = (error as Error).message;
    const statusCode = errorMessage.includes("not found")
      ? 404
      : errorMessage.includes("already exists")
      ? 409
      : 400;
    res.status(statusCode).json({
      success: false,
      message: errorMessage,
    });
  }
};

export const userController = {
  createUser,
  getUser,
  updateUser,
};
