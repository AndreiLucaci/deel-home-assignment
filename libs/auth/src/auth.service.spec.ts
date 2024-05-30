import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { TokenService } from './token.service';
import { UserService } from '@app/storage/user.service';
import { CryptoService } from '@app/utils/crypto/crypto.service';

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
          provide: UserService,
          useValue: jest.fn(),
        },
        {
          provide: CryptoService,
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
