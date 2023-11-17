import { Test, TestingModule } from '@nestjs/testing';
import { AtributeService } from './atribute.service';

describe('AtributeService', () => {
  let service: AtributeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AtributeService],
    }).compile();

    service = module.get<AtributeService>(AtributeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
