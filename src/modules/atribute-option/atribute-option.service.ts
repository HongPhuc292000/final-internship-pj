import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/services/base-crud.service';
import { AtributeOption } from './entities/atribute-option.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AtributeOptionService extends BaseService<AtributeOption> {
  constructor(
    @InjectRepository(AtributeOption)
    private atributeOptionRepository: Repository<AtributeOption>,
  ) {
    super(atributeOptionRepository);
  }
}
