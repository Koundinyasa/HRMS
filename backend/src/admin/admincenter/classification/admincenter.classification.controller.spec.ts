import { Test, TestingModule } from '@nestjs/testing';
import { AdmincenterClassificationController } from './admincenter.classification.controller';

describe('AdmincenterClassificationController', () => {
  let controller: AdmincenterClassificationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdmincenterClassificationController],
    }).compile();

    controller = module.get<AdmincenterClassificationController>(
      AdmincenterClassificationController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
