import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ImageLink } from './entities/image-link.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/services/base-crud.service';
import { CreateImageLinkDto } from './dto/createImageLink.dto';

@Injectable()
export class ImageLinkService extends BaseService<ImageLink> {
  constructor(
    @InjectRepository(ImageLink)
    private imageLinkRepository: Repository<ImageLink>,
  ) {
    super(imageLinkRepository);
  }

  createMultipleImageLink(createImageLinkDto: CreateImageLinkDto) {
    const { imageUrls } = createImageLinkDto;
    const dataToCreate = imageUrls.map((item) => ({ imageUrl: item }));
    const createdImages = this.imageLinkRepository.create(dataToCreate);
    return createdImages;
  }

  createImageLink(imageUrl: string) {
    const createdImages = this.imageLinkRepository.create({
      imageUrl: imageUrl,
    });
    return createdImages;
  }
}
