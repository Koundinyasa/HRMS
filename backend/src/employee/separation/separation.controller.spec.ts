import { Test, TestingModule } from '@nestjs/testing';
import { SeparationController } from './separation.controller';

describe('SeparationController', () => {
  let controller: SeparationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SeparationController],
    }).compile();

    controller = module.get<SeparationController>(SeparationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
