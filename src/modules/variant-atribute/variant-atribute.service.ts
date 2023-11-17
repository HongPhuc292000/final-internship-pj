import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/services/base-crud.service';
import { VariantAtribute } from './entities/variant-atribute.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class VariantAtributeService extends BaseService<VariantAtribute> {
  constructor(
    @InjectRepository(VariantAtribute)
    private variantAtributeRepository: Repository<VariantAtribute>,
  ) {
    super(variantAtributeRepository);
  }
}
