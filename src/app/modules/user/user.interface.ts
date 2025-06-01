import { Model } from 'mongoose';

export type IUser = {
   username: string;
   name: string;
   role: string;
   email: string;
   password: string;
   avatar: string;
   refreshToken?: string;
};

export type UserModel = Model<IUser, Record<string, unknown>>;
