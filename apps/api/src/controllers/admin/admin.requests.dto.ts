import { UserCreateRequest } from '@app/domain/typings/user.types';

export class AdminCreateRequestDto
  implements
    Pick<UserCreateRequest, 'email' | 'password' | 'firstName' | 'lastName'>
{
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}
