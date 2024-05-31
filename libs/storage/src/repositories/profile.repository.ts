import { Profile, ProfileType } from '@app/domain/entities/profile.model';
import { UserCreateRequest } from '@app/domain/typings/user.types';
import { anonymizeName } from '@app/utils';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Transaction } from 'sequelize';
import { v4 as uuid } from 'uuid';

@Injectable()
export class ProfileRepository {
  constructor(@InjectModel(Profile) private profileModel: typeof Profile) {}

  async createProfile(userCreateRequest: UserCreateRequest, userId: string) {
    const profile = this.profileModel.create({
      id: uuid(),
      firstName: userCreateRequest.firstName,
      lastName: userCreateRequest.lastName,
      profession: userCreateRequest.profession,
      type: userCreateRequest.type,
      userId,
    });

    return profile;
  }

  async softDeleteProfile(userId: string, adminId: string) {
    const [firstName, lastName] = anonymizeName().split(' ');
    return this.profileModel.update(
      {
        deletedBy: adminId,
        firstName,
        lastName,
        type: ProfileType.CLIENT,
      },
      { where: { userId } },
    );
  }

  async findClientProfileById(profileId: string) {
    return this.profileModel.findOne({
      where: {
        id: profileId,
        type: ProfileType.CLIENT,
      },
    });
  }

  async updateProfileBalanceTransaction(
    transaction: Transaction,
    profileId: string,
    amount: number,
  ) {
    return this.profileModel.update(
      { balance: amount },
      {
        where: { id: profileId },
        transaction,
      },
    );
  }
}
