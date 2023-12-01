import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/services/base-crud.service';
import { QueryRunner, Repository } from 'typeorm';
import { AddVariantDto, CreateVariantDto } from './dto/createVariant.dto';
import { Variant } from './entities/variant.entity';
import { ImageLinkService } from '../image-link/image-link.service';
import { UpdateVariantDto } from './dto/updateVariant.dto';
import { VariantAtributeService } from '../variant-atribute/variant-atribute.service';
import { omitObject } from 'src/utils/handleObject';

@Injectable()
export class VariantService extends BaseService<Variant> {
  constructor(
    @InjectRepository(Variant) private variantRepository: Repository<Variant>,
    private imageLinkService: ImageLinkService,
    private variantAtributeService: VariantAtributeService,
  ) {
    super(variantRepository);
  }

  async createNewVariant(createVariantDto: CreateVariantDto) {
    const { imageUrl, set, ...rest } = createVariantDto;
    const newVariant = this.variantRepository.create(rest);
    const newImage = this.imageLinkService.createImageLink(imageUrl);
    newVariant.image = newImage;

    const variantAtributes = await Promise.all(
      set.map((setItem) => {
        return this.variantAtributeService.createNewVariantAtribute(setItem);
      }),
    );

    newVariant.variantAtributes = variantAtributes;

    return newVariant;
  }

  async updateVariant(updateVariantDto: UpdateVariantDto) {
    const { id, imageUrl, set, initialPrice, reducedPrice, totalInstock } =
      updateVariantDto;
    if (id) {
      const createdVariant = await this.findExistedData(
        {
          relations: { variantAtributes: true },
          where: { id },
        },
        'variant',
      );
      createdVariant.initialPrice = initialPrice || createdVariant.initialPrice;
      createdVariant.reducedPrice = reducedPrice || createdVariant.reducedPrice;
      if (imageUrl) {
        const newImage = this.imageLinkService.createImageLink(imageUrl);
        createdVariant.image = newImage;
      }

      if (set) {
        const variantAtributes = await Promise.all(
          set.map((setItem) => {
            return this.variantAtributeService.updateVariantAtributeDemo(
              setItem,
            );
          }),
        );

        // const oldVariantAtributes = createdVariant.variantAtributes;
        // const ids = new Set(variantAtributes.map((d) => d.id));
        // const mergedVariantAtributes = [
        //   ...variantAtributes,
        //   ...oldVariantAtributes.filter((d) => !ids.has(d.id)),
        // ];

        createdVariant.variantAtributes = variantAtributes;
      }

      return createdVariant;
    } else {
      if (
        !imageUrl ||
        !set ||
        !initialPrice ||
        !reducedPrice ||
        !totalInstock
      ) {
        throw new BadRequestException({
          error: 'Bad Request',
          message: 'data of new variant not valid',
        });
      }

      const newVariant = await this.createNewVariant(
        omitObject(updateVariantDto, ['id']) as CreateVariantDto,
      );

      return newVariant;
    }
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

  async removeVariant(id: string) {
    const variant = await this.findExistedData({ where: { id } }, 'variant');
    return await this.softRemoveData(variant);
  }
}
