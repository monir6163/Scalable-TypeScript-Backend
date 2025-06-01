import { NextFunction, Request, Response } from 'express';
import rateLimit from 'express-rate-limit';
import { sendResponse } from '../../shared/sendResponse';

const rateLimiter = rateLimit({
   windowMs: 15 * 60 * 1000,
   max: 10,
   standardHeaders: true,
   legacyHeaders: false,
   handler: (
      req: Request,
      res: Response,
      _next: NextFunction,
      options: { statusCode: number }
   ) => {
      sendResponse(res, {
         statusCode: options.statusCode,
         success: false,
         message: 'Too many user creation attempts, please try again later.',
         data: null,
      });
   },
});

export const RateLimiter = {
   rateLimiter,
};
