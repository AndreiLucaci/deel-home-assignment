import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { HashConstants } from '../constants/hash';

@Injectable()
export class CryptoService {
  async hashPassword(password: string): Promise<string> {
    const hash = await bcrypt.hash(password, HashConstants.SALT_OR_ROUNDS);

    return hash;
  }

  async comparePassword(password: string, hash: string): Promise<boolean> {
    const isMatch = await bcrypt.compare(password, hash);

    return isMatch;
  }
}
