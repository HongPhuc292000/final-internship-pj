import { Injectable } from '@nestjs/common';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { ImageLink } from './entities/image-link.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/services/base-crud.service';
import { AddImageLinkDto, CreateImageLinkDto } from './dto/createImageLink.dto';

@Injectable()
export class ImageLinkService extends BaseService<ImageLink> {
  constructor(
    @InjectRepository(ImageLink)
    private imageLinkRepository: Repository<ImageLink>,
  ) {
    super(imageLinkRepository);
  }

  createImageLink(imageUrl: string) {
    const createdImages = this.imageLinkRepository.create({
      imageUrl: imageUrl,
    });
    return createdImages;
  }

  addNewImageLink(queryRunner: QueryRunner, addImageLinkDto: AddImageLinkDto) {
    const { productId, imageUrl, variantId } = addImageLinkDto;
    if (productId) {
      return this.addNewDataWithQueryRunner(queryRunner, {
        product: { id: productId },
        imageUrl,
      });
    }

    if (variantId) {
      return this.addNewDataWithQueryRunner(queryRunner, {
        variant: { id: variantId },
        imageUrl,
      });
    }

    return this.addNewDataWithQueryRunner(queryRunner, { imageUrl });
  }
}
