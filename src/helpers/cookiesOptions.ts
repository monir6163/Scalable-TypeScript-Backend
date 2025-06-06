/* eslint-disable @typescript-eslint/no-explicit-any */
import ms from 'ms';
import config from '../config';

const getMs = (value: string | undefined, fallback: string): number => {
   const result = ms(value ?? (fallback as any));
   if (typeof result === 'undefined') throw new Error('Invalid time format');
   return result as undefined extends typeof result ? number : never;
};

export const accessTokenCookieOptions = {
   secure: config.env === 'production',
   httpOnly: true,
   sameSite: 'strict' as const,
   maxAge: getMs(config.jwt.secret_expires, '1h'),
};

export const cookieOptions = {
   secure: config.env === 'production',
   httpOnly: true,
   sameSite: 'strict' as const,
   maxAge: getMs(config.jwt.refresh_expires, '7d'),
};
