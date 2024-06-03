import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { TokenService } from './token.service';
import { CryptoService } from '@app/utils/crypto/crypto.service';
import { UserRepository } from '@app/storage/repositories/user.repository';
import { ProfileRepository } from '@app/storage/repositories/profile.repository';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: TokenService,
          useValue: jest.fn(),
        },
        {
          provide: UserRepository,
          useValue: jest.fn(),
        },
        {
          provide: CryptoService,
          useValue: jest.fn(),
        },
        {
          provide: ProfileRepository,
          useValue: jest.fn(),
        },
        AuthService,
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
