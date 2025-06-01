export type ILoginUser = {
   email: string;
   username?: string;
   password: string;
};
export type ILoginResponse = {
   accessToken: string;
   refreshToken?: string;
};
export type IRefreshToken = {
   accessToken: string;
};

export type IChangePassword = {
   oldPassword: string;
   newPassword: string;
};
