import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { BaseService } from 'src/services/base-crud.service';
import {
  ECommonRecordId,
  EEntityName,
  ListResponseData,
  ResponseData,
} from 'src/types';
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

  async handleCheckNameIsUsed(conditions: { parentId: string; name: string }) {
    await this.checkUniqueFieldDataIsUsed(
      {
        relations: { parent: true },
        where: {
          name: conditions.name,
          parent: {
            id: conditions.parentId,
          },
        },
      },
      'category name',
    );
  }

  async addNewCategory(
    createCategoryDto: CreateCategoryDto,
  ): Promise<ResponseData<string>> {
    const { parentId, ...rest } = createCategoryDto;
    const newCategory = this.categoryRepository.create(rest);
    await this.handleCheckNameIsUsed({ parentId, name: rest.name });
    if (parentId) {
      const parent = await this.findExistedData(
        { where: { id: parentId } },
        'category',
      );
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
    const result = await this.findRecordWithResponse(
      { where: { id }, relations: { childs: true } },
      EEntityName.CATEGORY,
    );
    result.data = plainToInstance(Category, result.data);
    return result;
  }

  async updateCategory(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<ResponseData<string>> {
    const { parentId, name } = updateCategoryDto;
    let category = await this.findExistedData(
      {
        relations: { parent: true },
        where: { id },
      },
      'category',
    );
    if (parentId) {
      await this.findExistedData(
        {
          where: { id: parentId },
        },
        'category',
      );
      if (name) {
        await this.checkUniqueFieldDataIsUsed(
          {
            relations: { parent: true },
            where: { name, parent: { id: parentId } },
          },
          'category name',
          id,
        );
        category.parent.id = parentId;
        category.name = name;
      } else {
        await this.checkUniqueFieldDataIsUsed(
          {
            relations: { parent: true },
            where: { name, parent: { id: category.parent.id } },
          },
          'category name',
          id,
        );
        category.parent.id = parentId;
      }
    } else {
      if (name) {
        await this.checkUniqueFieldDataIsUsed(
          {
            relations: { parent: true },
            where: { name, parent: { id: category.parent.id } },
          },
          'category name',
          id,
        );
        category.name = name;
      }
    }
    return this.updateData(category);
  }

  async removeCategory(id: string): Promise<ResponseData<string>> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const category = await this.categoryRepository.findOne({
        where: {
          id,
        },
        relations: {
          childs: true,
          products: true,
        },
      });
      const commonCategory = await this.categoryRepository.findOne({
        where: {
          id: ECommonRecordId.CATEGORY,
        },
        relations: {
          products: true,
        },
      });

      if (category.childs.length) {
        throw new BadRequestException({
          message: "delete it's child category first",
          error: 'Bad Request',
        });
      }
      commonCategory.products = [
        ...commonCategory.products,
        ...category.products,
      ];
      category.products = [];
      await this.categoryRepository.save(commonCategory);
      const result = await this.removeData(category);
      await queryRunner.commitTransaction();
      return result;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      error.response = { message: error.message };
      throw new HttpException(error.response, error.status);
    } finally {
      await queryRunner.release();
    }
  }
}
