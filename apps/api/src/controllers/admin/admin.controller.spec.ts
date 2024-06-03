import { AdminService } from '@app/admin';
import { AuthService } from '@app/auth';
import { DeelSeeder } from '@app/storage/seeder/deel.seeder';
import { QueryBus } from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthGuard } from '../../guards/auth.guard';
import { AdminController } from './admin.controller';

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
          provide: AdminService,
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
        {
          provide: QueryBus,
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
