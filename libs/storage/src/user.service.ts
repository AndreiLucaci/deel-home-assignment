import { User } from '@app/domain';
import { UserCreateRequest } from '@app/domain/typings/user.types';
import { UserAlreadyExistsException } from '@app/exceptions/auth.exception';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { v4 as uuid } from 'uuid';

@Injectable()
export class UserService {
  constructor(@InjectModel(User) private userModel: typeof User) {}

  public async createUser(request: UserCreateRequest) {
    if (await this.getUserByEmail(request.email)) {
      throw new UserAlreadyExistsException();
    }

    return this.userModel.create({
      ...request,
      // make sure this is the last field
      id: uuid(),
    });
  }

  public async getUserByEmail(email: string) {
    return this.userModel.findOne({ where: { email } });
  }
}
