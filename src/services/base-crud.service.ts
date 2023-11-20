import {
  HttpStatus,
  NotFoundException,
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import {
  DataSource,
  DeepPartial,
  FindOptionsWhere,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';
import { IBaseService } from 'src/types/BaseService';
import { CustomBaseEntity } from 'src/utils/base.entity';
import {
  ECreateResponseString,
  ListResponseData,
  ResponseData,
} from 'src/types';
import { ICommonQuery } from 'src/types/Query';

@Injectable()
export abstract class BaseService<Entity extends CustomBaseEntity>
  implements IBaseService<Entity>
{
  constructor(private readonly genericRepository: Repository<Entity>) {}

  async checkUniqueFieldDataIsUsed(
    where: FindOptionsWhere<Entity>,
    targetName: string,
  ) {
    const entity = await this.genericRepository.findOne({ where });
    if (entity) {
      throw new BadRequestException({
        message: `${targetName} is used`,
        error: 'Bad Request',
      });
    }
  }

  async findExistedData(where: FindOptionsWhere<Entity>, targetName: string) {
    const entity = await this.genericRepository.findOne({ where });
    if (entity) {
      return entity;
    } else {
      throw new BadRequestException({
        message: `not found ${targetName}`,
        error: 'Bad Request',
      });
    }
  }

  async addNewData(createEntityDto: DeepPartial<Entity>): Promise<Entity> {
    const newVariant = this.genericRepository.create(createEntityDto);
    return await this.genericRepository.save(newVariant);
  }

  async addNewDataWithResponse(entity: Entity): Promise<ResponseData<string>> {
    const createdEntity = await this.genericRepository.save(entity);
    return new ResponseData(createdEntity.id, HttpStatus.CREATED);
  }

  async addNewMultipleDataWithResponse(
    entities: Entity[],
  ): Promise<ResponseData<string>> {
    const createdEntities = await Promise.allSettled(
      entities.map(async (entity) => {
        const savedEntity = await this.genericRepository.save(entity);
        return savedEntity.id;
      }),
    )
      .then((res) => {
        const dataResponse = res.map((item) => {
          if (item.status === 'fulfilled') {
            return item.value;
          } else {
            return ECreateResponseString.FAILED;
          }
        });
        return dataResponse;
      })
      .catch((err) => {
        throw new InternalServerErrorException(err);
      });
    return new ResponseData(createdEntities, HttpStatus.CREATED);
  }

  async handleCommonQuery(
    selectQueryBuilder: SelectQueryBuilder<Entity>,
    commonQuery: ICommonQuery,
  ): Promise<ListResponseData<Entity>> {
    const { page = 1, size = 10, all } = commonQuery;
    const queryPage = page;
    const querySize = size;
    selectQueryBuilder.skip(all ? 0 : (page - 1) * size);
    if (!all) {
      selectQueryBuilder.take(size);
    }
    const records = await selectQueryBuilder.getMany();
    const totalRecord = await this.genericRepository.count();
    if (all) {
      return new ListResponseData(records, totalRecord);
    }
    return new ListResponseData(records, totalRecord, queryPage, querySize);
  }

  async findById(id: any, entityName: string): Promise<ResponseData<Entity>> {
    const entity = await this.genericRepository.findOne({ where: { id } });
    if (!entity) {
      throw new NotFoundException({
        message: `not found this ${entityName}`,
        error: 'Not Found',
      });
    }
    return new ResponseData(entity);
  }

  async updateData(entity: Entity, newData: Partial<Entity>) {
    const updatedEntity = await this.genericRepository.save({
      ...entity,
      ...newData,
    });

    return new ResponseData(updatedEntity.id);
  }

  async removeData(entity: Entity) {
    await this.genericRepository.save(entity);
    await this.genericRepository.softRemove(entity);
    return new ResponseData('Deleted');
  }
}
