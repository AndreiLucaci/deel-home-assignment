import { Injectable, UnauthorizedException } from '@nestjs/common';

import { CryptoService } from '@app/utils/crypto/crypto.service';
import {
  UserCreateRequest,
  UserCreateResponse,
  UserLoginRequest,
  UserLoginResponse,
} from '@app/domain/typings/user.types';
import { UserService } from '@app/storage/user.service';
import { Roles, User } from '@app/domain';
import { TokenService } from './token.service';
import { ProfileService } from '@app/storage/profile.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly cryptoService: CryptoService,
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
    private readonly profileService: ProfileService,
  ) {}

  public async createUser(
    createUserRequest: UserCreateRequest,
  ): Promise<UserCreateResponse> {
    return this.registerUserEntity(createUserRequest);
  }

  public async createAdmin(
    createUserRequest: UserCreateRequest,
  ): Promise<UserCreateResponse> {
    return this.registerUserEntity(createUserRequest, Roles.ADMIN);
  }

  public async login(
    loginRequest: UserLoginRequest,
  ): Promise<UserLoginResponse> {
    const user = await this.userService.findUserByEmail(loginRequest.email);

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

  private async registerUserEntity(
    createUserRequest: UserCreateRequest,
    role: Roles = Roles.USER,
  ) {
    const hashedPassword = await this.cryptoService.hashPassword(
      createUserRequest.password,
    );

    const user = await this.userService.createUser({
      ...createUserRequest,
      password: hashedPassword,
      role,
    });

    const profile = await this.profileService.createProfile(
      createUserRequest,
      user.id,
    );
    user.profile = profile;

    return {
      id: user.id,
      email: user.email,
      name: user.name,
    };
  }

  private async checkPasswordValidity(password: string, user: User) {
    return this.cryptoService.comparePassword(password, user.password);
  }
}
