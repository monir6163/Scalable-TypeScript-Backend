import config from '../config';

export const cookieOptions = {
   secure: config.env === 'production',
   httpOnly: true,
};
