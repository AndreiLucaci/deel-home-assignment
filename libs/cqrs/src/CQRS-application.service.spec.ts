import { Test, TestingModule } from '@nestjs/testing';
import { CQRSApplicationService } from './CQRS-application.service';

describe('CQRSApplicationService', () => {
  let service: CQRSApplicationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CQRSApplicationService],
    }).compile();

    service = module.get<CQRSApplicationService>(CQRSApplicationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
