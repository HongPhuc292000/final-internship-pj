import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/services/base-crud.service';
import { VariantAtribute } from './entities/variant-atribute.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SetVariantDto } from './dto/createVariantAtribute.dto';
import { AtributeService } from '../atribute/atribute.service';
import { AtributeOptionService } from '../atribute-option/atribute-option.service';

@Injectable()
export class VariantAtributeService extends BaseService<VariantAtribute> {
  constructor(
    @InjectRepository(VariantAtribute)
    private variantAtributeRepository: Repository<VariantAtribute>,
    private atributeService: AtributeService,
    private atributeOptionService: AtributeOptionService,
  ) {
    super(variantAtributeRepository);
  }

  async addNewMultipleVariantAtribute(setVariantDto: SetVariantDto[]) {
    const variantAtributes = setVariantDto.map(async (variantAtribute) => {
      const atribute = await this.atributeService.findExistedData(
        { id: variantAtribute.atribute },
        'atribute',
      );
      const atributeOption = await this.atributeOptionService.findExistedData({
        id: variantAtribute.atributeOption,
      });
      const createdVariantAtribute = this.variantAtributeRepository.create({
        atribute: atribute,
        atributeOption: atributeOption,
      });
      return createdVariantAtribute;
    });

    return Promise.all(variantAtributes).then((res) => res);
  }
}
