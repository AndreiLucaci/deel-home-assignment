import { Injectable, UnauthorizedException } from '@nestjs/common';

import { CryptoService } from '@app/utils/crypto/crypto.service';
import {
  UserCreateRequest,
  UserCreateResponse,
  UserLoginRequest,
  UserLoginResponse,
} from '@app/domain/typings/user.types';
import { UserService } from '@app/storage/user.service';
import { User } from '@app/domain';
import { TokenService } from './token.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly cryptoService: CryptoService,
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
  ) {}

  public async createUser(
    createUserRequest: UserCreateRequest,
  ): Promise<UserCreateResponse> {
    const hashedPassword = await this.cryptoService.hashPassword(
      createUserRequest.password,
    );

    const user = await this.userService.createUser({
      ...createUserRequest,
      password: hashedPassword,
    });

    return {
      id: user.id,
      email: user.email,
      name: user.name,
    };
  }

  public async login(
    loginRequest: UserLoginRequest,
  ): Promise<UserLoginResponse> {
    const user = await this.userService.getUserByEmail(loginRequest.email);

    if (!user) {
      throw new UnauthorizedException();
    }

    const isPasswordValid = await this.checkPasswordValidity(
      loginRequest.password,
      user,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException();
    }

    const token = await this.tokenService.generateAccessToken(user, []);

    return { token };
  }

  private async checkPasswordValidity(password: string, user: User) {
    return this.cryptoService.comparePassword(password, user.password);
  }
}
