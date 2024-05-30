import { Module } from '@nestjs/common';
import { CryptoModule } from './crypto/crypto.module';
import { CryptoService } from './crypto/crypto.service';

@Module({
  imports: [CryptoModule],
  providers: [CryptoService],
  exports: [CryptoService],
})
export class UtilsModule {}
