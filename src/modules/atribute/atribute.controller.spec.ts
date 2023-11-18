import { Test, TestingModule } from '@nestjs/testing';
import { AtributeController } from './atribute.controller';

describe('AtributeController', () => {
  let controller: AtributeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AtributeController],
    }).compile();

    controller = module.get<AtributeController>(AtributeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
