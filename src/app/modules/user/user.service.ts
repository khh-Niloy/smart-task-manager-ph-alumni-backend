import { User } from "./user.model";
import { IUser } from "./user.interface";
import { jwtServices } from "../../utils/jwt";

const createUserService = async (playLoad: Partial<IUser>) => {
  const { email, password, name } = playLoad;

  const isEmailExist = await User.findOne({ email });
  if (isEmailExist) {
    throw new Error("User already exist with this email");
  }

  const hashedPassword = await jwtServices.generateHashedPass(
    password as string
  );

  const newCreatedUser = await User.create({
    email,
    password: hashedPassword,
    name,
  });

  const jwtPayload = {
    userId: newCreatedUser._id,
    email: newCreatedUser.email,
  };

  const { accessToken, refreshToken } =
    jwtServices.generateAccessRefreshToken(jwtPayload);

  return { newCreatedUser, accessToken, refreshToken };
};

const getUserService = async (userId: string) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }
  return user;
};

const updateUserService = async (userId: string, payload: Partial<IUser>) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }

  if(payload.password) {
    const hashedPassword = await jwtServices.generateHashedPass(
      payload.password as string
    );
    payload.password = hashedPassword;
  }

  const updatedUser = await User.findByIdAndUpdate(userId, payload, {
    new: true,
    runValidators: true,
  });
  
  return updatedUser;
};

export const userServices = {
  createUserService,
  getUserService,
  updateUserService,
};
