import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Secret } from 'jsonwebtoken';
import config from '../../config';
import ApiError from '../../errors/ApiError';
import { jwtHelpers } from '../../helpers/jwtHelpers';
import { User } from '../modules/user/user.model';

export const auth =
   (...userRoles: string[]) =>
   async (req: Request, res: Response, next: NextFunction) => {
      try {
         const token =
            req.cookies.accessToken ||
            req.headers.authorization?.replace(/^Bearer\s/, '');

         if (!token) {
            throw new ApiError(
               StatusCodes.UNAUTHORIZED,
               'You are not authorized'
            );
         }

         let verifiedUser = null;

         verifiedUser = jwtHelpers.verifyToken(
            token,
            config.jwt.secret_token as Secret
         );
         // lastly
         if (verifiedUser?.exp && verifiedUser?.exp * 1000 < Date.now()) {
            throw new ApiError(
               StatusCodes.UNAUTHORIZED,
               'Token has expired, please login again'
            );
         }
         // lastly
         if (!verifiedUser?.id) {
            throw new ApiError(
               StatusCodes.UNAUTHORIZED,
               'Invalid token, please login again'
            );
         }
         const currentUser = await User.findById(verifiedUser?.id).select(
            '-password -refreshToken'
         );
         // lastly
         if (!currentUser) {
            throw new ApiError(
               StatusCodes.UNAUTHORIZED,
               'User not found, please login again'
            );
         }

         req.user = currentUser;
         if (userRoles.length && !userRoles.includes(verifiedUser.role)) {
            throw new ApiError(StatusCodes.FORBIDDEN, 'Forbidden access.');
         }
         next();
      } catch (error) {
         next(error);
      }
   };
