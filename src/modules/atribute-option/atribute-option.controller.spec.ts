import { Test, TestingModule } from '@nestjs/testing';
import { AtributeOptionController } from './atribute-option.controller';

describe('AtributeOptionController', () => {
  let controller: AtributeOptionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AtributeOptionController],
    }).compile();

    controller = module.get<AtributeOptionController>(AtributeOptionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
