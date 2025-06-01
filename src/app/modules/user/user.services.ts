/* eslint-disable @typescript-eslint/no-explicit-any */
import { IUser } from './user.interface';
import { User } from './user.model';

const getCurrentUser = async (id: string): Promise<IUser | null> => {
   const result = await User.findById(id).select('-password -refreshToken');
   return result;
};

const getSingleUser = async (id: string): Promise<IUser | null> => {
   return await User.findById(id);
};
const getAllUsers = async (): Promise<IUser[] | null> => {
   return await User.find();
};

export const UserServices = {
   getCurrentUser,
   getSingleUser,
   getAllUsers,
};
