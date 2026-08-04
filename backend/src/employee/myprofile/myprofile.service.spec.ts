import { Test, TestingModule } from '@nestjs/testing';
import { MyprofileService } from './myprofile.service';

describe('MyprofileService', () => {
  let service: MyprofileService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MyprofileService],
    }).compile();

    service = module.get<MyprofileService>(MyprofileService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
