import { User } from '@app/domain';
import { Profile } from '../entities/profile.model';

export type UserCreateRequest = Pick<User, 'email' | 'password'> &
  Pick<Profile, 'firstName' | 'lastName' | 'profession' | 'type'>;

export type UserCreateResponse = Pick<User, 'id' | 'email' | 'name'>;

export type UserLoginRequest = Pick<User, 'email' | 'password'>;

export type UserLoginResponse = {
  token: string;
};
