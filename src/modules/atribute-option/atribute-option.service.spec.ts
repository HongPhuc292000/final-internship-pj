import { Test, TestingModule } from '@nestjs/testing';
import { AtributeOptionService } from './atribute-option.service';

describe('AtributeOptionService', () => {
  let service: AtributeOptionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AtributeOptionService],
    }).compile();

    service = module.get<AtributeOptionService>(AtributeOptionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
