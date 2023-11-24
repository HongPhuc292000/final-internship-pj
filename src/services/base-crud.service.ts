import {
  HttpStatus,
  NotFoundException,
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import {
  DeepPartial,
  FindManyOptions,
  FindOneOptions,
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

  // find record
  async checkExistedDataBoolean(where: FindOptionsWhere<Entity>) {
    return await this.genericRepository.findOne({ where });
  }

  // find record has field is unique, if found throw error
  async checkUniqueFieldDataIsUsed(
    options: FindOneOptions<Entity>,
    targetName: string,
  ) {
    const entity = await this.genericRepository.findOne(options);
    if (entity) {
      throw new BadRequestException({
        message: `${targetName} is used`,
        error: 'Bad Request',
      });
    }
  }

  // find record is exited or not. if found return record. if not, throw error
  async findExistedData(options: FindOneOptions<Entity>, targetName?: string) {
    const entity = await this.genericRepository.findOne(options);
    if (entity) {
      return entity;
    } else {
      throw new BadRequestException({
        message: `not found ${targetName}`,
        error: 'Bad Request',
      });
    }
  }

  // add new record to db with a createDto
  async addNewData(createEntityDto: DeepPartial<Entity>): Promise<Entity> {
    const newEntity = this.genericRepository.create(createEntityDto);
    return await this.genericRepository.save(newEntity);
  }

  // add new record to db with an entity created and return a response
  async addNewDataWithResponse(entity: Entity): Promise<ResponseData<string>> {
    const createdEntity = await this.genericRepository.save(entity);
    return new ResponseData(createdEntity.id, HttpStatus.CREATED);
  }

  // add new multiple record and response
  async addNewMultipleDataWithResponse(
    entities: Entity[],
  ): Promise<ResponseData<string>> {
    if (entities.length > 1) {
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
    const savedEntity = await this.genericRepository.save(entities[0]);
    return new ResponseData(savedEntity.id, HttpStatus.CREATED);
  }

  // handle common query with repo
  async handleCommonQueryRepo(
    options: FindManyOptions<Entity>,
    commonQuery: ICommonQuery,
  ) {
    const { page = 1, size = 10, all } = commonQuery;
    if (!all) {
      options.take = size;
      options.skip = size * (page - 1);
    }
    const records = await this.genericRepository.find(options);
    const totalRecord = await this.genericRepository.count();
    if (all) {
      return new ListResponseData(records, totalRecord);
    }
    return new ListResponseData(records, totalRecord, +page, +size);
  }

  // handle common query
  async handleCommonQuery(
    selectQueryBuilder: SelectQueryBuilder<Entity>,
    commonQuery: ICommonQuery,
  ): Promise<ListResponseData<Entity>> {
    const { page = 1, size = 10, all } = commonQuery;
    if (!all) {
      selectQueryBuilder.skip(all ? 0 : (page - 1) * size);
      selectQueryBuilder.take(size);
    }
    const records = await selectQueryBuilder.getMany();
    const totalRecord = await this.genericRepository.count();
    if (all) {
      return new ListResponseData(records, totalRecord);
    }
    return new ListResponseData(records, totalRecord, +page, +size);
  }

  // find one by id with response
  async findRecordWithResponse(
    options: FindOneOptions<Entity>,
    entityName: string,
  ): Promise<ResponseData<Entity>> {
    const entity = await this.genericRepository.findOne(options);
    if (!entity) {
      throw new NotFoundException({
        message: `not found this ${entityName}`,
        error: 'Not Found',
      });
    }
    return new ResponseData(entity);
  }

  // update data existed
  async updateData(entity: Entity) {
    const updatedEntity = await this.genericRepository.save(entity);
    return new ResponseData(updatedEntity.id);
  }

  // soft remove data
  async softRemoveData(entity: Entity) {
    await this.genericRepository.save(entity);
    await this.genericRepository.softRemove(entity);
    return new ResponseData('Deleted');
  }

  // remove data
  async removeData(entity: Entity) {
    // await this.genericRepository.save(entity);
    await this.genericRepository.remove(entity);
    return new ResponseData('Deleted');
  }
}
