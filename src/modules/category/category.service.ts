import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { BaseService } from 'src/services/base-crud.service';
import { EEntityName, ListResponseData, ResponseData } from 'src/types';
import { ICategoryQuery } from 'src/types/Query';
import { DataSource, Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoryService extends BaseService<Category> {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    private dataSource: DataSource,
  ) {
    super(categoryRepository);
  }

  async addNewCategory(
    createCategoryDto: CreateCategoryDto,
  ): Promise<ResponseData<string>> {
    const { parentId, ...rest } = createCategoryDto;
    const newCategory = this.categoryRepository.create(rest);
    await this.checkUniqueFieldDataIsUsed({ name: rest.name }, 'category name');
    if (parentId) {
      const parent = await this.findExistedData({ id: parentId }, 'category');
      newCategory.parent = parent;
    }
    return this.addNewDataWithResponse(newCategory);
  }

  async findAllCategory(
    query: ICategoryQuery,
  ): Promise<ListResponseData<Category>> {
    const { parentId, searchKey = '', ...rest } = query;
    const specifiedQuery = this.categoryRepository
      .createQueryBuilder('category')
      .where('category.name like :searchKey', {
        searchKey: `%${searchKey}%`,
      });
    if (parentId) {
      specifiedQuery.andWhere('category.parent_id = :parentId', {
        parentId,
      });
    }
    const result = await this.handleCommonQuery(specifiedQuery, rest);
    result.data = plainToInstance(Category, result.data);
    return result;
  }

  async findOneCategory(id: string): Promise<ResponseData<Category>> {
    const result = await this.findByIdWithResponse(id, EEntityName.CATEGORY);
    result.data = plainToInstance(Category, result.data);
    return result;
  }

  async updateCategory(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<ResponseData<string>> {
    const { parentId, ...rest } = updateCategoryDto;
    await this.checkUniqueFieldDataIsUsed({ name: rest.name }, 'category name');
    const category = await this.categoryRepository.findOne({
      where: { id },
      relations: { parent: true },
    });
    if (parentId && category.parent.id !== parentId) {
      const newParent = await this.categoryRepository.findOneBy({
        id: parentId,
      });
      category.parent = newParent;
    }
    return this.updateData(category, rest);
  }

  async removeCategory(id: string): Promise<ResponseData<string>> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const category = await this.categoryRepository.findOneBy({ id });
      category.childs = [];
      const result = await this.removeData(category);
      await queryRunner.commitTransaction();
      return result;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException({
        message: 'something bad happen',
      });
    } finally {
      await queryRunner.release();
    }
  }
}
