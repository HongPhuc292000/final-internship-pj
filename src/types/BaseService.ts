import { SelectQueryBuilder } from 'typeorm';
import { ListResponseData, ResponseData } from './Response';

export interface IBaseService<T> {
  saveNewData(entity: T): Promise<ResponseData<string>>;
  handlePageSize(
    selectQueryBuilder: SelectQueryBuilder<T>,
    page?: number,
    size?: number,
  ): Promise<ListResponseData<T>>;
  findById(id: any, entityName: string): Promise<ResponseData<T>>;
  updateData(entity: T, newData: Partial<T>): Promise<ResponseData<string>>;
  removeData(entity: T): Promise<ResponseData<string>>;
}
