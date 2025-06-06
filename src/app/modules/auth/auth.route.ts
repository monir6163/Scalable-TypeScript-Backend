import express from 'express';
import { auth } from '../../middleware/auth';
import { RateLimiter } from '../../middleware/rateLimiter';
import { validateRequest } from '../../middleware/validateRequest';
import { AuthController } from './auth.controller';
import { AuthValidation } from './auth.validation';

const router = express.Router();

router.post(
   '/create',
   validateRequest(AuthValidation.createUserZodSchema),
   AuthController.createUser
);

router.post(
   '/login',
   RateLimiter.rateLimiter,
   validateRequest(AuthValidation.createLoginZodSchema),
   AuthController.loginUser
);
router.post(
   '/refresh-token',
   validateRequest(AuthValidation.createRefreshTokenZodSchema),
   // auth(),
   AuthController.refreshToken
);
router.get('/logout', auth(), AuthController.logout);

router.post(
   '/change-password',
   validateRequest(AuthValidation.changePasswordZodSchema),
   auth(),
   AuthController.changePassword
);

export const AuthRoutes = router;
