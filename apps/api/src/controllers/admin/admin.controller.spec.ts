import { Test, TestingModule } from '@nestjs/testing';
import { AdminController } from './admin.controller';
import { DeelSeeder } from '@app/storage/seeder/deel.seeder';
import { AuthService } from '@app/auth';
import { AuthGuard } from '../../guards/auth.guard';
import { JwtService } from '@nestjs/jwt';

describe('AdminController', () => {
  let controller: AdminController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: JwtService,
          useValue: jest.fn(),
        },
        {
          provide: DeelSeeder,
          useValue: jest.fn(),
        },
        {
          provide: AuthService,
          useValue: jest.fn(),
        },
        {
          provide: AuthGuard,
          useValue: jest.fn(),
        },
      ],
      controllers: [AdminController],
    }).compile();

    controller = module.get<AdminController>(AdminController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
