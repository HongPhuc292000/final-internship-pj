import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/services/base-crud.service';
import { Repository } from 'typeorm';
import { SetVariantDto } from './dto/createVariantAtribute.dto';
import { VariantAtribute } from './entities/variant-atribute.entity';
import { AtributeOptionService } from '../atribute-option/atribute-option.service';
import { UpdateSetVariantDto } from './dto/updateVariantAtribute.dto';
import { AtributeService } from '../atribute/atribute.service';

@Injectable()
export class VariantAtributeService extends BaseService<VariantAtribute> {
  constructor(
    @InjectRepository(VariantAtribute)
    private variantAtributeRepository: Repository<VariantAtribute>,
    private atributeOptionService: AtributeOptionService,
    private atributeService: AtributeService,
  ) {
    super(variantAtributeRepository);
  }

  async createNewVariantAtribute(setVariantAtribute: SetVariantDto) {
    const { atribute, atributeOption } = setVariantAtribute;
    if (!atribute || !atributeOption) {
      throw new BadRequestException({
        error: 'Bad Request',
        message: 'data of new variant atribute not valid',
      });
    }

    await this.atributeOptionService.checkDataMatched(
      {
        relations: { atribute: true },
        where: {
          id: atributeOption,
          atribute: {
            id: atribute,
          },
        },
      },
      'atribute and option are not match',
    );
    const newSetVariant = this.variantAtributeRepository.create({
      atribute: { id: atribute },
      atributeOption: { id: atributeOption },
    });

    return newSetVariant;
  }

  async updateVariantAtributeDemo(
    updateSetVariantAtribute: UpdateSetVariantDto,
  ) {
    const { id, atribute, atributeOption } = updateSetVariantAtribute;

    if (id) {
      const createdVariantAtribute = await this.findExistedData(
        {
          relations: { atribute: true, atributeOption: true },
          where: { id },
        },
        'variant atribute',
      );

      const newAtributeOption = {
        atributeOptionId: atributeOption
          ? atributeOption
          : createdVariantAtribute.atributeOption.id,
        atributeId: atribute ? atribute : createdVariantAtribute.atribute.id,
      };

      await this.atributeOptionService.checkDataMatched(
        {
          relations: { atribute: true },
          where: {
            id: newAtributeOption.atributeOptionId,
            atribute: {
              id: newAtributeOption.atributeId,
            },
          },
        },
        'atribute and option are not match',
      );

      createdVariantAtribute.atribute.id = newAtributeOption.atributeId;
      createdVariantAtribute.atributeOption.id =
        newAtributeOption.atributeOptionId;

      return createdVariantAtribute;
    } else {
      if (!atribute || !atributeOption) {
        throw new BadRequestException({
          error: 'Bad Request',
          message: 'data of new variant atribute not valid',
        });
      }
      const newSetVariant = await this.createNewVariantAtribute({
        atribute,
        atributeOption,
      });
      return newSetVariant;
    }
  }
}
