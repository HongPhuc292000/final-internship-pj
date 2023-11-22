import { Test, TestingModule } from '@nestjs/testing';
import { ImageLinkService } from './image-link.service';

describe('ImageLinkService', () => {
  let service: ImageLinkService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ImageLinkService],
    }).compile();

    service = module.get<ImageLinkService>(ImageLinkService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
