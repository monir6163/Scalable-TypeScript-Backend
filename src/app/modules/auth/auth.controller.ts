import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { cookieOptions } from '../../../helpers/cookiesOptions';
import { catchAsync } from '../../../shared/catchAsync';
import { sendResponse } from '../../../shared/sendResponse';
import { IUser } from '../user/user.interface';
import { ILoginResponse } from './auth.interface';
import { AuthServices } from './auth.services';

const createUser = catchAsync(async (req: Request, res: Response) => {
   const result = await AuthServices.createUser(req.body);

   sendResponse<IUser>(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: 'User Created successfully..!!',
      data: result,
   });
});

const loginUser = catchAsync(async (req: Request, res: Response) => {
   const { ...loginData } = req.body;

   const result = await AuthServices.loginUser(loginData);

   // set refresh token into cookie
   res.cookie('accessToken', result?.accessToken, cookieOptions);
   res.cookie('refreshToken', result?.refreshToken, cookieOptions);
   sendResponse<ILoginResponse>(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: 'User logged successfully..!!',
      data: null,
   });
});
const refreshToken = catchAsync(async (req: Request, res: Response) => {
   const { refreshToken } =
      req.cookies ||
      (req.headers.authorization
         ? { refreshToken: req.headers.authorization.replace(/^Bearer\s/, '') }
         : {});

   const result = await AuthServices.refreshToken(refreshToken);

   // set refresh token into cookie
   res.cookie('accessToken', result?.accessToken, cookieOptions);
   res.cookie('refreshToken', result?.refreshToken, cookieOptions);

   sendResponse<ILoginResponse>(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: 'Get refresh token successfully..!!',
      data: null,
   });
});

const changePassword = catchAsync(async (req: Request, res: Response) => {
   const user = req.user;
   const { ...passwordData } = req.body;

   await AuthServices.changePassword(user, passwordData);

   sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Password changed successfully !',
   });
});

// const forgetPassword = catchAsync(async (req: Request, res: Response) => {});

const logout = catchAsync(async (req: Request, res: Response) => {
   await AuthServices.logout(req.user);
   // clear cookies
   res.clearCookie('accessToken', cookieOptions);
   res.clearCookie('refreshToken', cookieOptions);
   sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Logout successfully',
   });
});

export const AuthController = {
   createUser,
   loginUser,
   refreshToken,
   changePassword,
   // forgetPassword,
   logout,
};
