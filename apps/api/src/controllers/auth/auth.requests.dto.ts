import {
  UserCreateRequest,
  UserLoginRequest,
} from '@app/domain/typings/user.types';

export class UserCreateRequestDto implements UserCreateRequest {
  email: string;
  password: string;
  name: string;
}

export class UserLoginRequestDto implements UserLoginRequest {
  email: string;
  password: string;
}
