import { Injectable } from '@nestjs/common';
import { AdminUserDeleteRequest, UserDeleteResponse } from './admin.types';
import { UserService } from '@app/storage/user.service';
import { ProfileService } from '@app/storage/profile.service';

@Injectable()
export class AdminService {
  constructor(
    private readonly userService: UserService,
    private readonly profileService: ProfileService,
  ) {}

  async softDeleteUser(
    request: AdminUserDeleteRequest,
  ): Promise<UserDeleteResponse> {
    const { adminId, email } = request;
    const user = await this.userService.findUserByEmail(email);

    if (!user) {
      return { success: false };
    }

    await this.userService.softDeleteUser(user.id, adminId);

    await this.profileService.softDeleteProfile(user.id, adminId);

    return { success: false };
  }
}
