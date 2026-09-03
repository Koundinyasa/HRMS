import { Test, TestingModule } from '@nestjs/testing';
import { SeparationService } from './separation.service';

describe('SeparationService', () => {
  let service: SeparationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SeparationService],
    }).compile();

    service = module.get<SeparationService>(SeparationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
