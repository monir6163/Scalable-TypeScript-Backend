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
   smtp: {
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 587,
      secure: process.env.SMTP_SECURE,
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
      from_email: process.env.FROM_EMAIL,
   },
};
