import { Test, TestingModule } from '@nestjs/testing';
import { AdmincenterController } from './admincenter.company.controller';

describe('AdmincenterController', () => {
  let controller: AdmincenterController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdmincenterController],
    }).compile();

    controller = module.get<AdmincenterController>(AdmincenterController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
