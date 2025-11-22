import { Request, Response } from "express";
import { authService } from "./auth.service";
import { cookiesService } from "../../utils/cookiesService";

const userLogin = async (req: Request, res: Response) => {
  try {
    const { user, accessToken, refreshToken } =
      await authService.userLoginService(req.body);

    cookiesService.setCookie(res, accessToken, refreshToken);

    res.status(200).json({
      success: true,
      message: "User logged in successfully",
      data: user,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: (error as Error).message,
    });
  }
};

const userLogOut = async (req: Request, res: Response) => {
  try {
    cookiesService.clearCookie(res);

    res.status(200).json({
      success: true,
      message: "User logged out successfully",
      data: null,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: (error as Error).message,
    });
  }
};

export const authController = {
  userLogin,
  userLogOut,
};
