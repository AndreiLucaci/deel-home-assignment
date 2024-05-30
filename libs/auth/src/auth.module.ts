import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CryptoModule } from '@app/utils/crypto/crypto.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtConfig } from '@app/utils/constants/jwt';
import { StorageModule } from '@app/storage';
import { TokenService } from './token.service';

@Module({
  imports: [
    CryptoModule,
    StorageModule,
    JwtModule.register({
      global: true,
      secret: JwtConfig.secret,
    }),
  ],
  providers: [TokenService, AuthService],
  exports: [TokenService, AuthService],
})
export class AuthModule {}
