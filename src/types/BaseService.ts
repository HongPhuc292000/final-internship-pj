import { ListResponseData, ResponseData } from './Response';

export interface IBaseService<T> {
  saveNewData(entity: T): Promise<ResponseData<string>>;
  findAll(
    query: string,
    page?: number,
    size?: number,
  ): Promise<ListResponseData<T>>;
  findById(id: any, entityName: string): Promise<ResponseData<T>>;
  updateData(entity: T, newData: Partial<T>): Promise<ResponseData<string>>;
  removeData(entity: T): Promise<ResponseData<string>>;
}
