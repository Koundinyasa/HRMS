import { Test, TestingModule } from '@nestjs/testing';
import { AdmincenterService } from './admincenter.company.service';

describe('AdmincenterService', () => {
  let service: AdmincenterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AdmincenterService],
    }).compile();

    service = module.get<AdmincenterService>(AdmincenterService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
