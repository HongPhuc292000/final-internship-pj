import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/services/base-crud.service';
import { ResponseData } from 'src/types';
import { IAtributeOption } from 'src/types/Query';
import { FindManyOptions, Like, Repository } from 'typeorm';
import { Atribute } from '../atribute/entities/atribute.entity';
import { CreateMultipleAtributeOptionDto } from './dto/createAtributeOption.dto';
import { AtributeOption } from './entities/atribute-option.entity';
import { UpdateAtributeOptionDto } from './dto/updateAtributeOption.dto';

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

  async findAllAtributeOption(query: IAtributeOption) {
    const { searchKey = '', atributeId, ...rest } = query;
    const specifiedQuery: FindManyOptions<AtributeOption> = {
      where: {
        value: Like(`%${searchKey}%`),
        atribute: {
          id: atributeId,
        },
      },
    };
    const result = await this.handleCommonQueryRepo(specifiedQuery, rest);
    return result;
  }

  async updateAtribute(
    id: string,
    updateAtributeOptionDto: UpdateAtributeOptionDto,
  ) {
    const value = updateAtributeOptionDto?.value;
    const atributeOption = await this.findExistedData(
      {
        relations: {
          atribute: true,
        },
        where: { id },
      },
      'atribute option',
    );
    if (value) {
      await this.checkUniqueFieldDataIsUsed(
        {
          relations: {
            atribute: true,
          },
          where: { value, atribute: { id: atributeOption.atribute.id } },
        },
        'atribute option name',
        id,
      );
      atributeOption.value = value;
    }

    return this.updateData(atributeOption);
  }

  async removeAtributeOption(id: string) {
    const atributeOption = await this.findExistedData(
      {
        relations: {
          variantAtributes: true,
        },
        where: { id },
      },
      'atribute',
    );

    if (atributeOption.variantAtributes.length) {
      throw new BadRequestException({
        error: 'Bad Request',
        message: 'atribute option is used in some variants',
      });
    }

    return await this.removeData(atributeOption);
  }
}
