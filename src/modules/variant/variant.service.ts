import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Variant } from './entities/variant.entity';
import { Repository } from 'typeorm';
import { BaseService } from 'src/services/base-crud.service';
import { ResponseData } from 'src/types';
import { CreateVariantDto } from './dto/createVariant.dto';
import { VariantAtributeService } from '../variant-atribute/variant-atribute.service';
import { omitObject } from 'src/utils/handleObject';

@Injectable()
export class VariantService extends BaseService<Variant> {
  constructor(
    @InjectRepository(Variant) private variantRepository: Repository<Variant>,
    private variantAtributeService: VariantAtributeService,
  ) {
    super(variantRepository);
  }

  async addNewMultipleVariant(createMultipleVariantDto: CreateVariantDto[]) {
    const createdVariants = createMultipleVariantDto.map(async (variant) => {
      const variantWithoutSet = this.variantRepository.create(
        omitObject(variant, ['set']),
      );
      const variantAtributeToCreate =
        await this.variantAtributeService.addNewMultipleVariantAtribute(
          variant.set,
        );
      variantWithoutSet.variantAtributes = variantAtributeToCreate;

      return variantWithoutSet;
    });
    return Promise.all(createdVariants).then((res) => res);
  }
}
