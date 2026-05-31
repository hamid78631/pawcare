import { Test, TestingModule } from '@nestjs/testing';
import { SitterProfileService } from './sitter-profile.service';

describe('SitterProfileService', () => {
  let service: SitterProfileService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SitterProfileService],
    }).compile();

    service = module.get<SitterProfileService>(SitterProfileService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
