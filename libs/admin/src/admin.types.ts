export type UserDeleteRequest = {
  email: string;
};

export type AdminUserDeleteRequest = UserDeleteRequest & {
  adminId: string;
};

export type UserDeleteResponse = {
  success: boolean;
};
