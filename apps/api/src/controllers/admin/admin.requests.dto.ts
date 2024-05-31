import { UserDeleteRequest } from '@app/admin/admin.types';
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

export class AdminUserDeleteRequestDto implements UserDeleteRequest {
  email: string;
}
