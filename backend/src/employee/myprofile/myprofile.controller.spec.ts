import { Test, TestingModule } from '@nestjs/testing';
import { MyprofileController } from './myprofile.controller';

describe('MyprofileController', () => {
  let controller: MyprofileController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MyprofileController],
    }).compile();

    controller = module.get<MyprofileController>(MyprofileController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
