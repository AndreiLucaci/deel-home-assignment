import { Roles, User } from '@app/domain';
import { UserCreateRequest } from '@app/domain/typings/user.types';
import { UserAlreadyExistsException } from '@app/exceptions/auth.exception';
import { anonymizeEmail, anonymizeName } from '@app/utils';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { v4 as uuid } from 'uuid';

@Injectable()
export class UserService {
  constructor(@InjectModel(User) private userModel: typeof User) {}

  public async createUser(request: UserCreateRequest) {
    if (await this.findUserByEmail(request.email)) {
      throw new UserAlreadyExistsException();
    }

    const composedName = `${request.firstName} ${request.lastName}`.trim();

    return this.userModel.create({
      email: request.email,
      name: composedName,
      // this is the hashed password
      password: request.password,
      // make sure this is the last field
      role: request.role,
      id: uuid(),
    });
  }

  public async findUserByEmail(email: string) {
    return this.userModel.findOne({ where: { email } });
  }

  public async softDeleteUser(userId: string, adminId: string) {
    return this.userModel.update(
      {
        deletedBy: adminId,
        name: anonymizeName(),
        email: anonymizeEmail(),
        role: Roles.USER,
      },
      { where: { id: userId } },
    );
  }
}
