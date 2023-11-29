import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/services/base-crud.service';
import { QueryRunner, Repository } from 'typeorm';
import { AddVariantDto, CreateVariantDto } from './dto/createVariant.dto';
import { Variant } from './entities/variant.entity';
import { UpdateVariantDto } from './dto/updateVariant.dto';
import {
  SetAtributeOptionToUpdateVariant,
  UpdatedVariantToProduct,
} from './types';
import { ImageLinkService } from '../image-link/image-link.service';

@Injectable()
export class VariantService extends BaseService<Variant> {
  constructor(
    @InjectRepository(Variant) private variantRepository: Repository<Variant>,
    private imageLinkService: ImageLinkService,
  ) {
    super(variantRepository);
  }

  async addNewVariant(
    queryRunner: QueryRunner,
    addNewVariantDto: AddVariantDto,
  ) {
    const { productId, ...rest } = addNewVariantDto;
    return await this.addNewDataWithQueryRunner(queryRunner, {
      product: { id: productId },
      ...rest,
    });
  }

  async addNewVariantToProduct(
    queryRunner: QueryRunner,
    productId: string,
    createVariantDto: CreateVariantDto,
  ) {
    const { set, imageUrl, ...rest } = createVariantDto;
    const createdVariant = await this.addNewVariant(queryRunner, {
      productId,
      ...rest,
    });
    const setWithVariantId: SetAtributeOptionToUpdateVariant[] = set.map(
      (item) => ({
        ...item,
        variantId: createdVariant.id,
      }),
    );
    return { variantId: createdVariant.id, imageUrl, set: setWithVariantId };
  }

  async updateVariantToProduct(
    queryRunner: QueryRunner,
    updateVariantDto: UpdateVariantDto,
  ) {
    const { set, imageUrl, id, initialPrice, reducedPrice } = updateVariantDto;
    const createdVariant = await this.findExistedData(
      {
        relations: { image: true },
        where: { id },
      },
      'variant',
    );

    createdVariant.initialPrice = initialPrice || createdVariant.initialPrice;
    createdVariant.reducedPrice = reducedPrice || createdVariant.reducedPrice;
    const oldImage = createdVariant.image;
    if (imageUrl) {
      const newImage = await this.imageLinkService.addNewImageLink(
        queryRunner,
        { imageUrl },
      );
      createdVariant.image = newImage;
    }

    const updatedVariant = await queryRunner.manager.save(createdVariant);
    await queryRunner.manager.remove(oldImage);
    const returnProduct: UpdatedVariantToProduct = {
      variantId: updatedVariant.id,
    };
    if (set) {
      const setWithVariantId: SetAtributeOptionToUpdateVariant[] = set.map(
        (item) => ({
          variantId: createdVariant.id,
          ...item,
        }),
      );

      returnProduct.set = setWithVariantId;
    }

    return returnProduct;
  }
}
