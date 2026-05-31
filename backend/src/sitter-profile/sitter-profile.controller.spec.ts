import { Test, TestingModule } from '@nestjs/testing';
import { SitterProfileController } from './sitter-profile.controller';

describe('SitterProfileController', () => {
  let controller: SitterProfileController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SitterProfileController],
    }).compile();

    controller = module.get<SitterProfileController>(SitterProfileController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
