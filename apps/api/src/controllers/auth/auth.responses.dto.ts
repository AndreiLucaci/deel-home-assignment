import {
  UserCreateResponse,
  UserLoginResponse,
} from '@app/domain/typings/user.types';

export class CreateUserResponseDto implements UserCreateResponse {
  id: string;
  email: string;
  name: string;
}

export class UserLoginResponseDto implements UserLoginResponse {
  token: string;
}

export class UserMeResponseDto {
  id: string;
  email: string;
  name: string;
}
