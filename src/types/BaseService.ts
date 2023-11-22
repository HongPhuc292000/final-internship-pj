import {
  DeepPartial,
  FindOneOptions,
  FindOptionsWhere,
  SelectQueryBuilder,
} from 'typeorm';
import { ListResponseData, ResponseData } from './Response';
import { ICommonQuery } from './Query';

export interface IBaseService<T> {
  addNewData(entity: DeepPartial<T>): Promise<T>;
  addNewDataWithResponse(entity: T): Promise<ResponseData<string>>;
  handleCommonQuery(
    selectQueryBuilder: SelectQueryBuilder<T>,
    commonQuery: ICommonQuery,
  ): Promise<ListResponseData<T>>;
  findRecordWithResponse(
    options: FindOneOptions<T>,
    entityName: string,
  ): Promise<ResponseData<T>>;
  updateData(entity: T, newData: Partial<T>): Promise<ResponseData<string>>;
  removeData(entity: T): Promise<ResponseData<string>>;
}
