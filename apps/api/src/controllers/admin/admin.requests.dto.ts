import { UserDeleteRequest } from '@app/admin/admin.types';
import { UserCreateRequest } from '@app/domain/typings/user.types';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class AdminCreateRequestDto
  implements
    Pick<UserCreateRequest, 'email' | 'password' | 'firstName' | 'lastName'>
{
  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}

export class AdminUserDeleteRequestDto implements UserDeleteRequest {
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
