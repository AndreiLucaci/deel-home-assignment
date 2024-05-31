import { Injectable, UnauthorizedException } from '@nestjs/common';

import { CryptoService } from '@app/utils/crypto/crypto.service';
import {
  UserCreateRequest,
  UserCreateResponse,
  UserLoginRequest,
  UserLoginResponse,
} from '@app/domain/typings/user.types';
import { Roles, User } from '@app/domain';
import { TokenService } from './token.service';
import { UserRepository } from '@app/storage/repositories/user.repository';
import { ProfileRepository } from '@app/storage/repositories/profile.repository';

@Injectable()
export class AuthService {
  constructor(
    private readonly cryptoService: CryptoService,
    private readonly tokenService: TokenService,
    private readonly userRepository: UserRepository,
    private readonly profileRepository: ProfileRepository,
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
    const user = await this.userRepository.findUserByEmail(loginRequest.email);

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

    const user = await this.userRepository.createUser({
      ...createUserRequest,
      password: hashedPassword,
      role,
    });

    const profile = await this.profileRepository.createProfile(
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
