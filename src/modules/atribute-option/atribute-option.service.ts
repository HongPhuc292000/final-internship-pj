import {
  Injectable,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/services/base-crud.service';
import { ICommonQuery } from 'src/types/Query';
import { Repository } from 'typeorm';
import { Atribute } from '../atribute/entities/atribute.entity';
import { CreateMultipleAtributeOptionDto } from './dto/createAtributeOption.dto';
import { AtributeOption } from './entities/atribute-option.entity';
import { ECreateResponseString, ResponseData } from 'src/types';

@Injectable()
export class AtributeOptionService extends BaseService<AtributeOption> {
  constructor(
    @InjectRepository(AtributeOption)
    private atributeOptionRepository: Repository<AtributeOption>,
    @InjectRepository(Atribute)
    private atributeRepository: Repository<Atribute>,
  ) {
    super(atributeOptionRepository);
  }

  async addNewAtributeOption(
    createMultipleAtributeOptionDto: CreateMultipleAtributeOptionDto,
  ): Promise<ResponseData<string>> {
    const { atributeId, data } = createMultipleAtributeOptionDto;
    const atribute = await this.atributeRepository.findOneBy({
      id: atributeId,
    });
    if (!atribute) {
      throw new BadRequestException({
        message: 'atribute not exist',
      });
    }
    const dataToSave = data.map((item) => {
      const newOption = this.atributeOptionRepository.create({
        value: item,
        atribute,
      });
      return newOption;
    });
    return this.addNewMultipleDataWithResponse(dataToSave);
  }

  async findAllAtributeOption(query: ICommonQuery) {
    const { searchKey = '', ...rest } = query;
    const specifiedQuery = this.atributeOptionRepository
      .createQueryBuilder('atribute_option')
      .where('atribute_option.value like :searchKey', {
        searchKey: `%${searchKey}%`,
      });
    const result = await this.handleCommonQuery(specifiedQuery, rest);
    return result;
  }
}
