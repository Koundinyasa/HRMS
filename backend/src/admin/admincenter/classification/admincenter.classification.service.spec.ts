import { Test, TestingModule } from '@nestjs/testing';
import { AdmincenterClassificationService } from './admincenter.classification.service';

describe('AdmincenterClassificationService', () => {
  let service: AdmincenterClassificationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AdmincenterClassificationService],
    }).compile();

    service = module.get<AdmincenterClassificationService>(AdmincenterClassificationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
