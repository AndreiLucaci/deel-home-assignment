import { Test, TestingModule } from '@nestjs/testing';
import { CryptoService } from './crypto.service';

describe('StorageService', () => {
  let service: CryptoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CryptoService],
    }).compile();

    service = module.get<CryptoService>(CryptoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should hash password', async () => {
    const password = 'password';
    const hash = await service.hashPassword(password);

    expect(hash).toBeDefined();
  });

  it('should compare passwords correctly', async () => {
    const password = 'password';
    const hash = await service.hashPassword(password);
    const isMatch = await service.comparePassword(password, hash);

    expect(isMatch).toBe(true);
  });
});
