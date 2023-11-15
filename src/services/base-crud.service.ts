import { HttpStatus, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { IBaseService } from 'src/types/BaseService';
import { CustomBaseEntity } from 'src/utils/base.entity';
import { ListResponseData, ResponseData } from 'src/types';

export abstract class BaseService<Entity extends CustomBaseEntity>
  implements IBaseService<Entity>
{
  constructor(private readonly genericRepository: Repository<Entity>) {}

  async saveNewData(entity: Entity) {
    const createdEntity = await this.genericRepository.save(entity);
    return new ResponseData(createdEntity.id, HttpStatus.CREATED);
  }

  async findAll(
    query: string,
    page?: number,
    size?: number,
  ): Promise<ListResponseData<Entity>> {
    const queryPage = page;
    const querySize = size;
    const queryToExcute = query.concat(
      `OFFSET ${(page - 1) * size} ROWS FETCH NEXT ${size} ROWS ONLY`,
    );
    const records = await this.genericRepository.query(queryToExcute);
    const totalRecord = await this.genericRepository.count();
    return new ListResponseData(records, queryPage, querySize, totalRecord);
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
