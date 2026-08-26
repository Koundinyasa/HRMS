import { Test, TestingModule } from '@nestjs/testing';
import { HelpdeskController } from './helpdesk.controller';

describe('HelpdeskController', () => {
  let controller: HelpdeskController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HelpdeskController],
    }).compile();

    controller = module.get<HelpdeskController>(HelpdeskController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
