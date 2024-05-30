import { User } from '@app/domain';

export type UserCreateRequest = Pick<User, 'email' | 'password' | 'name'>;

export type UserCreateResponse = Pick<User, 'id' | 'email' | 'name'>;

export type UserLoginRequest = Pick<User, 'email' | 'password'>;

export type UserLoginResponse = {
  token: string;
};
