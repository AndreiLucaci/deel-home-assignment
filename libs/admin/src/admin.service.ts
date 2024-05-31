import { Injectable } from '@nestjs/common';
import { AdminUserDeleteRequest, UserDeleteResponse } from './admin.types';
import { UserRepository } from '@app/storage/repositories/user.repository';
import { ProfileRepository } from '@app/storage/repositories/profile.repository';

@Injectable()
export class AdminService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly profileRepository: ProfileRepository,
  ) {}

  async softDeleteUser(
    request: AdminUserDeleteRequest,
  ): Promise<UserDeleteResponse> {
    const { adminId, email } = request;
    const user = await this.userRepository.findUserByEmail(email);

    if (!user) {
      return { success: false };
    }

    await this.userRepository.softDeleteUser(user.id, adminId);

    await this.profileRepository.softDeleteProfile(user.id, adminId);

    return { success: false };
  }
}
