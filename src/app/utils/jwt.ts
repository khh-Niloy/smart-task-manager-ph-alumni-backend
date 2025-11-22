import bcryptjs from "bcryptjs";
import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";
import { envVars } from "../config/env";

const generateHashedPass = (pass: string) => {
  return bcryptjs.hash(pass, parseInt(envVars.BCRYPT_SALT_ROUND));
};

const checkHashedPassword = (pass: string, hashedPass: string) => {
  return bcryptjs.compare(pass, hashedPass);
};

const generateAccessRefreshToken = (payload: JwtPayload) => {
  const accessToken = jwt.sign(payload, envVars.JWT_ACCESS_SECRET, {
    expiresIn: envVars.JWT_ACCESS_EXPIRES,
  } as SignOptions);

  const refreshToken = jwt.sign(payload, envVars.JWT_REFRESH_SECRET, {
    expiresIn: envVars.JWT_REFRESH_EXPIRES,
  } as SignOptions);
  
  return { accessToken, refreshToken };
};

const verifyToken = (token: string, secret: string) => {
  return jwt.verify(token, secret);
};

export const jwtServices = {
  generateHashedPass,
  checkHashedPassword,
  generateAccessRefreshToken,
  verifyToken,
};
