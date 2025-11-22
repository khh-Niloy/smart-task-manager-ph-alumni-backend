import { JwtPayload } from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import { envVars } from "../config/env";
import { User } from "../modules/user/user.model";
import { jwtServices } from "../utils/jwt";

export const roleBasedProtection =
  () => async (req: Request, res: Response, next: NextFunction) => {
    const accessToken = req.cookies.accessToken;

    if (!accessToken) {
      throw new Error("access token not found!");
    }

    const userInfoJWTAccessToken = jwtServices.verifyToken(
      accessToken,
      envVars.JWT_ACCESS_SECRET
    ) as JwtPayload;

    // Prefer userId to avoid relying on optional identifiers like email/phone
    const user = await User.findById(userInfoJWTAccessToken.userId);

    if (!user) {
      throw new Error("user found!");
    }
    req.user = userInfoJWTAccessToken;

    next();
  };
