import { Module } from '@nestjs/common';
import { CryptoModule } from './crypto/crypto.module';

@Module({
  exports: [CryptoModule],
})
export class UtilsModule {}
