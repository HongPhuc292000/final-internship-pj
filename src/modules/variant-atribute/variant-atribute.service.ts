import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/services/base-crud.service';
import { QueryRunner, Repository } from 'typeorm';
import { CreateVariantAtributeDto } from './dto/createVariantAtribute.dto';
import { VariantAtribute } from './entities/variant-atribute.entity';
import { AtributeOptionService } from '../atribute-option/atribute-option.service';
import { UpdateVariantAtributeDto } from './dto/updateVariantAtribute.dto';

@Injectable()
export class VariantAtributeService extends BaseService<VariantAtribute> {
  constructor(
    @InjectRepository(VariantAtribute)
    private variantAtributeRepository: Repository<VariantAtribute>,
    private atributeOptionService: AtributeOptionService,
  ) {
    super(variantAtributeRepository);
  }

  async addNewVariantAtribute(
    queryRunner: QueryRunner,
    createVariantAtributeDto: CreateVariantAtributeDto,
  ) {
    const { variantId, atributeId, atributeOptionId } =
      createVariantAtributeDto;
    await this.atributeOptionService.checkDataMatched(
      {
        relations: { atribute: true },
        where: {
          id: atributeOptionId,
          atribute: {
            id: atributeId,
          },
        },
      },
      'atribute and option are not match',
    );

    const dataToCreate = {
      variant: { id: variantId },
      atribute: { id: atributeId },
      atributeOption: { id: atributeOptionId },
    };
    return this.addNewDataWithQueryRunner(queryRunner, dataToCreate);
  }

  async updateVariantAtribute(
    queryRunner: QueryRunner,
    createVariantAtributeDto: UpdateVariantAtributeDto,
  ) {
    const { id, atributeId, atributeOptionId } = createVariantAtributeDto;
    const createdVariantAtribute = await this.findExistedData({
      relations: { atribute: true, atributeOption: true },
      where: { id },
    });

    const newAtributeOption = {
      atributeOptionId: atributeOptionId
        ? atributeOptionId
        : createdVariantAtribute.atributeOption.id,
      atributeId: atributeId ? atributeId : createdVariantAtribute.atribute.id,
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

    return await queryRunner.manager.save(createdVariantAtribute);
  }
}
