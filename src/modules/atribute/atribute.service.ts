import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/services/base-crud.service';
import { Atribute } from './entities/atribute.entity';
import { Repository } from 'typeorm';
import { CreateAtributeDto } from './dto/createAtribute.dto';

@Injectable()
export class AtributeService extends BaseService<Atribute> {
  constructor(
    @InjectRepository(Atribute)
    private atributeRepository: Repository<Atribute>,
  ) {
    super(atributeRepository);
  }
}
