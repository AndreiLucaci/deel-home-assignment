import { User } from '@app/domain';
import { JwtConfig } from '@app/utils/constants/jwt';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class TokenService {
  constructor(private readonly jwtService: JwtService) {}

  public generateAccessToken(user: User, claims: string[]): Promise<string> {
    return this.jwtService.signAsync(
      {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        // if any?
        ...claims.map((x) => ({ [x]: true })),
      },
      {
        expiresIn: JwtConfig.expiresIn,
        audience: JwtConfig.audience,
        issuer: JwtConfig.issuer,
      },
    );
  }
}
