import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/services/base-crud.service';
import { Atribute } from './entities/atribute.entity';
import { Repository } from 'typeorm';
import { CreateAtributeDto } from './dto/createAtribute.dto';
import { ICommonQuery } from 'src/types/Query';
import { UpdateAtributeDto } from './dto/updateAtribute.dto';

@Injectable()
export class AtributeService extends BaseService<Atribute> {
  constructor(
    @InjectRepository(Atribute)
    private atributeRepository: Repository<Atribute>,
  ) {
    super(atributeRepository);
  }

  async addNewAtribute(createAtributeDto: CreateAtributeDto) {
    await this.checkUniqueFieldDataIsUsed(
      { where: { name: createAtributeDto.name } },
      'atribute name',
    );
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

  async updateAtribute(id: string, updateAtributeDto: UpdateAtributeDto) {
    const name = updateAtributeDto?.name;
    const atribute = await this.findExistedData({ where: { id } }, 'atribute');
    if (name) {
      await this.checkUniqueFieldDataIsUsed(
        { where: { name } },
        'atribute name',
        id,
      );
      atribute.name = name;
    }

    return this.updateData(atribute);
  }

  async removeAtribute(id: string) {
    const atribute = await this.findExistedData(
      {
        relations: {
          variantAtributes: true,
        },
        where: { id },
      },
      'atribute',
    );

    if (atribute.variantAtributes.length) {
      throw new BadRequestException({
        error: 'Bad Request',
        message: 'atribute is used in some variants',
      });
    }

    return await this.removeData(atribute);
  }
}
