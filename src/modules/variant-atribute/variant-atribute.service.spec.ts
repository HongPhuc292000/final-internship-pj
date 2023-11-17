import { Test, TestingModule } from '@nestjs/testing';
import { VariantAtributeService } from './variant-atribute.service';

describe('VariantAtributeService', () => {
  let service: VariantAtributeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VariantAtributeService],
    }).compile();

    service = module.get<VariantAtributeService>(VariantAtributeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
