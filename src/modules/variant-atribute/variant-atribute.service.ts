import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/services/base-crud.service';
import { Repository } from 'typeorm';
import { CreateVariantAtributeDto } from './dto/createVariantAtribute.dto';
import { VariantAtribute } from './entities/variant-atribute.entity';

@Injectable()
export class VariantAtributeService extends BaseService<VariantAtribute> {
  constructor(
    @InjectRepository(VariantAtribute)
    private variantAtributeRepository: Repository<VariantAtribute>,
  ) {
    super(variantAtributeRepository);
  }

  async addNewVariantAtribute(
    createVariantAtributeDto: CreateVariantAtributeDto,
  ) {
    const { variantId, atributeId, atributeOptionId } =
      createVariantAtributeDto;
    const dataToCreate = {
      variant: { id: variantId },
      atribute: { id: atributeId },
      atributeOption: { id: atributeOptionId },
    };
    return this.addNewData(dataToCreate);
  }
}
