import { Test, TestingModule } from '@nestjs/testing';
import { JobsController } from './jobs.controller';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { AuthGuard } from '../../guards/auth.guard';
import { JwtService } from '@nestjs/jwt';

describe('JobsController', () => {
  let controller: JobsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: JwtService,
          useValue: jest.fn(),
        },
        {
          provide: AuthGuard,
          useValue: jest.fn(),
        },
        {
          provide: CommandBus,
          useValue: jest.fn(),
        },
        {
          provide: QueryBus,
          useValue: jest.fn(),
        },
      ],
      controllers: [JobsController],
    }).compile();

    controller = module.get<JobsController>(JobsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
