import bcrypt from 'bcrypt';
import { StatusCodes } from 'http-status-codes';
import { JwtPayload, Secret } from 'jsonwebtoken';
import config from '../../../config';
import ApiError from '../../../errors/ApiError';
import { jwtHelpers } from '../../../helpers/jwtHelpers';
import { IUser } from '../user/user.interface';
import { User } from '../user/user.model';
import { IChangePassword, ILoginResponse, ILoginUser } from './auth.interface';

const createUser = async (payload: IUser): Promise<IUser | null> => {
   const isUserExist = await User.findOne({
      $or: [{ email: payload.email }, { username: payload.username }],
   });
   if (isUserExist) {
      throw new ApiError(
         StatusCodes.CONFLICT,
         'User already exists with this email or username'
      );
   }
   const result = await User.create(payload);
   return result;
};
const loginUser = async (
   payload: ILoginUser
): Promise<ILoginResponse | null> => {
   const { email, username, password } = payload;

   const isUserExist = await User.findOne({
      $or: [{ email }, { username: username }],
   });

   if (!isUserExist) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'User does not exist');
   }

   const isPasswordMatched = await bcrypt.compare(
      password,
      isUserExist.password
   );

   if (!isPasswordMatched) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, 'Password is incorrect');
   }

   // create access,refresh token
   const accessToken = jwtHelpers.createToken(
      { id: isUserExist?._id, email, role: isUserExist?.role },
      config.jwt.secret_token as Secret,
      config.jwt.secret_expires as string
   );

   const refreshToken = jwtHelpers.createToken(
      { id: isUserExist?._id },
      config.jwt.refresh_token as Secret,
      config.jwt.refresh_expires as string
   );

   // update refresh token into database
   isUserExist.refreshToken = refreshToken;
   await isUserExist.save({ validateBeforeSave: false });

   return {
      refreshToken,
      accessToken,
   };
};

const refreshToken = async (token: string): Promise<ILoginResponse | null> => {
   console.log('Refreshing token...');
   let verifiedToken = null;
   // lastly
   if (!token) {
      throw new ApiError(StatusCodes.FORBIDDEN, 'Refresh Token is required');
   }
   try {
      verifiedToken = jwtHelpers.verifyToken(
         token,
         config.jwt.refresh_token as Secret
      );
   } catch (err) {
      throw new ApiError(StatusCodes.FORBIDDEN, 'Invalid Refresh Token');
   }
   const { id } = verifiedToken;

   const isUserExist = await User.findById(id, {
      email: 1,
      role: 1,
      refreshToken: 1,
      _id: 1,
   });
   if (!isUserExist) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'User does not exist');
   }
   // lastly
   if (!isUserExist.refreshToken || isUserExist.refreshToken !== token) {
      throw new ApiError(StatusCodes.FORBIDDEN, 'Refresh Token is not matched');
   }

   // create new access token
   const accessToken = jwtHelpers.createToken(
      {
         id: isUserExist?._id,
         email: isUserExist?.email,
         role: isUserExist?.role,
      },
      config.jwt.secret_token as Secret,
      config.jwt.secret_expires as string
   );

   const refreshToken = jwtHelpers.createToken(
      { id: isUserExist?._id },
      config.jwt.refresh_token as Secret,
      config.jwt.refresh_expires as string
   );
   // lastly update refresh token into database
   isUserExist.refreshToken = refreshToken;
   await isUserExist.save({ validateBeforeSave: false });

   return {
      accessToken,
      refreshToken,
   };
};

const changePassword = async (
   user: JwtPayload | null,
   payload: IChangePassword
): Promise<void> => {
   const { oldPassword, newPassword } = payload;

   if (oldPassword === newPassword) {
      throw new ApiError(
         StatusCodes.BAD_REQUEST,
         'New password must be different from old password'
      );
   }

   // checking is user exist
   const isUserExist = await User.findById(user?.id).select(
      '+password +email +username +role'
   );

   if (!isUserExist) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'User does not exist');
   }

   // checking old password
   const isPasswordMatched = await bcrypt.compare(
      oldPassword,
      isUserExist.password
   );

   if (!isPasswordMatched) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, 'Password is incorrect');
   }
   isUserExist.password = newPassword;
   await isUserExist.save({ validateBeforeSave: false });
};

const logout = async (user: JwtPayload | null): Promise<void> => {
   const query = { email: user?.email };
   await User.findOneAndUpdate(
      query,
      {
         refreshToken: '',
      },
      {
         new: true,
      }
   );
};

export const AuthServices = {
   createUser,
   loginUser,
   refreshToken,
   changePassword,
   logout,
};
