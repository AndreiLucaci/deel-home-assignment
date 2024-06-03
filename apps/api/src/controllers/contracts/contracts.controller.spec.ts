import { Test, TestingModule } from '@nestjs/testing';
import { ContractsController } from './contracts.controller';
import { QueryBus } from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';

describe('ContractsController', () => {
  let controller: ContractsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: JwtService,
          useValue: jest.fn(),
        },
        {
          provide: QueryBus,
          useValue: jest.fn(),
        },
      ],
      controllers: [ContractsController],
    }).compile();

    controller = module.get<ContractsController>(ContractsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
