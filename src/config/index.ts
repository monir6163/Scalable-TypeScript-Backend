import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

export default {
   env: process.env.NODE_DEV,
   port: process.env.PORT,
   database_url: process.env.DATABASE_URL,
   bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS
      ? Number(process.env.BCRYPT_SALT_ROUNDS)
      : 10,
   jwt: {
      secret_token: process.env.JWT_SECKRET_TOKEN,
      secret_expires: process.env.JWT_EXPIRE_IN,
      refresh_token: process.env.JWT_REFRESH_TOKEN,
      refresh_expires: process.env.JWT_REFRESH_EXPIRE_IN,
   },
   cors_origin: process.env.CORS_ORIGIN,
   cloudinary: {
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
   },
};
