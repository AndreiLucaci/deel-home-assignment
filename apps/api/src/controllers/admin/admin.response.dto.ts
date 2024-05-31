import { UserDeleteResponse } from '@app/admin/admin.types';

export class AdminUserDeleteResponseDto implements UserDeleteResponse {
  success: boolean;
}
