import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/services/base-crud.service';
import { Atribute } from './entities/atribute.entity';
import { Repository } from 'typeorm';
import { CreateAtributeDto } from './dto/createAtribute.dto';
import { ICommonQuery } from 'src/types/Query';

@Injectable()
export class AtributeService extends BaseService<Atribute> {
  constructor(
    @InjectRepository(Atribute)
    private atributeRepository: Repository<Atribute>,
  ) {
    super(atributeRepository);
  }

  async addNewAtribute(createAtributeDto: CreateAtributeDto) {
    const newAtribute = this.atributeRepository.create(createAtributeDto);
    return this.addNewDataWithResponse(newAtribute);
  }

  async findAllAtribute(query: ICommonQuery) {
    const { searchKey = '', ...rest } = query;
    const specifiedQuery = this.atributeRepository
      .createQueryBuilder('atribute')
      .where('atribute.name like :searchKey', {
        searchKey: `%${searchKey}%`,
      });
    const result = await this.handleCommonQuery(specifiedQuery, rest);
    return result;
  }
}
