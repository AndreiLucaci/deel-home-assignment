import { Profile } from '@app/domain/entities/profile.model';
import { UserCreateRequest } from '@app/domain/typings/user.types';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class ProfileService {
  constructor(@InjectModel(Profile) private profileModel: typeof Profile) {}

  async createProfile(userCreateRequest: UserCreateRequest, userId: string) {
    const profile = this.profileModel.create({
      firstName: userCreateRequest.firstName,
      lastName: userCreateRequest.lastName,
      profession: userCreateRequest.profession,
      type: userCreateRequest.type,
      userId,
    });

    return profile;
  }
}
