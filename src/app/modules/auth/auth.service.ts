import { jwtServices } from "../../utils/jwt";
import { IUser } from "../user/user.interface";
import { User } from "../user/user.model";

const userLoginService = async (playLoad: Partial<IUser>) => {
  const { email, password } = playLoad;

  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("Please register first");
  }

  const isPasswordCorrect = await jwtServices.checkHashedPassword(
    password as string,
    user.password as string
  );

  if (!isPasswordCorrect) {
    throw new Error("password did not match!");
  }

  const jwtPayload = {
    userId: user._id,
    email: user.email,
  };

  const { accessToken, refreshToken } =
    jwtServices.generateAccessRefreshToken(jwtPayload);

  return { user, accessToken, refreshToken };
};

export const authService = {
  userLoginService,
};
