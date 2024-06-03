import { ProfileType } from '@app/domain/entities/profile.model';
import {
  UserCreateRequest,
  UserLoginRequest,
} from '@app/domain/typings/user.types';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class UserCreateRequestDto implements Omit<UserCreateRequest, 'role'> {
  @IsNotEmpty()
  @ApiProperty({ enum: ProfileType, enumName: 'ProfileType' })
  type: ProfileType;

  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  @IsNotEmpty()
  profession: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}

export class UserLoginRequestDto implements UserLoginRequest {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}
