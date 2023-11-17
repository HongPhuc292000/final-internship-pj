import { DeepPartial, SelectQueryBuilder } from 'typeorm';
import { ListResponseData, ResponseData } from './Response';

export interface IBaseService<T> {
  addNewData(entity: DeepPartial<T>): Promise<T>;
  addNewDataWithResponse(entity: T): Promise<ResponseData<string>>;
  handlePageSize(
    selectQueryBuilder: SelectQueryBuilder<T>,
    page?: number,
    size?: number,
  ): Promise<ListResponseData<T>>;
  findById(id: any, entityName: string): Promise<ResponseData<T>>;
  updateData(entity: T, newData: Partial<T>): Promise<ResponseData<string>>;
  removeData(entity: T): Promise<ResponseData<string>>;
}
