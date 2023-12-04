import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';
import { BaseService } from 'src/services/base-crud.service';
import { IVariantQuery } from 'src/types/Query';
import { omitObject } from 'src/utils/handleObject';
import { FindManyOptions, QueryRunner, Repository } from 'typeorm';
import { ImageLinkService } from '../image-link/image-link.service';
import { VariantAtributeService } from '../variant-atribute/variant-atribute.service';
import { AddVariantDto, CreateVariantDto } from './dto/createVariant.dto';
import { UpdateVariantDto } from './dto/updateVariant.dto';
import { Variant } from './entities/variant.entity';
import { ListVariantResponse } from './types';

@Injectable()
export class VariantService extends BaseService<Variant> {
  constructor(
    @InjectRepository(Variant) private variantRepository: Repository<Variant>,
    private imageLinkService: ImageLinkService,
    private variantAtributeService: VariantAtributeService,
  ) {
    super(variantRepository);
  }

  async createNewVariant(
    createVariantDto: CreateVariantDto,
    atributeIds?: string[],
  ) {
    const { imageUrl, set, ...rest } = createVariantDto;
    const newVariant = this.variantRepository.create(rest);
    const newImage = this.imageLinkService.createImageLink(imageUrl);
    newVariant.image = newImage;

    if (atributeIds) {
      const variantAtributes = await Promise.all(
        set.map((setItem) => {
          return this.variantAtributeService.createNewVariantAtribute(
            setItem,
            atributeIds,
          );
        }),
      );

      newVariant.variantAtributes = variantAtributes;
    }

    return newVariant;
  }

  async updateVariant(
    updateVariantDto: UpdateVariantDto,
    atributeIds?: string[],
  ) {
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
      if (atributeIds) {
        if (set) {
          const variantAtributes = await Promise.all(
            set.map((setItem) => {
              return this.variantAtributeService.updateVariantAtributeDemo(
                setItem,
                atributeIds,
              );
            }),
          );
          createdVariant.variantAtributes = variantAtributes;
        }
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
        atributeIds,
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

  async getAllVariant(query: IVariantQuery) {
    const { productId, ...rest } = query;
    const specifiedOptions: FindManyOptions<Variant> = {
      relations: {
        product: true,
        variantAtributes: {
          atribute: true,
          atributeOption: true,
        },
        image: true,
      },
      where: {
        product: { id: productId },
      },
    };
    const result = await this.handleCommonQueryRepo(specifiedOptions, rest);
    const newData = plainToClass(ListVariantResponse, result.data);

    return {
      ...result,
      data: newData,
    };
  }
}
