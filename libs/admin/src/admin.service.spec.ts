import { Test, TestingModule } from '@nestjs/testing';
import { AdminService } from './admin.service';
import { UserRepository } from '@app/storage/repositories/user.repository';
import { ProfileRepository } from '@app/storage/repositories/profile.repository';

describe('AdminService', () => {
  let service: AdminService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: UserRepository,
          useValue: jest.fn(),
        },
        {
          provide: ProfileRepository,
          useValue: jest.fn(),
        },
        AdminService,
      ],
    }).compile();

    service = module.get<AdminService>(AdminService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
