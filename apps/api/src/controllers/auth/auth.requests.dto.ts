import { ProfileType } from '@app/domain/entities/profile.model';
import {
  UserCreateRequest,
  UserLoginRequest,
} from '@app/domain/typings/user.types';
import { ApiProperty } from '@nestjs/swagger';

export class UserCreateRequestDto implements UserCreateRequest {
  @ApiProperty({ enum: ProfileType, enumName: 'ProfileType' })
  type: ProfileType;
  firstName: string;
  lastName: string;
  profession: string;
  email: string;
  password: string;
}

export class UserLoginRequestDto implements UserLoginRequest {
  email: string;
  password: string;
}
