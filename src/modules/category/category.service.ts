import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { BaseService } from 'src/services/base-crud.service';
import { Category } from './entities/category.entity';
import { EEntityName, ListResponseData, ResponseData } from 'src/types';
import { CommonQuery } from 'src/types/Query';

@Injectable()
export class CategoryService extends BaseService<Category> {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {
    super(categoryRepository);
  }

  async addNewCategory(
    createCategoryDto: CreateCategoryDto,
  ): Promise<ResponseData<string>> {
    const { parentId } = createCategoryDto;
    const newCategory = this.categoryRepository.create(createCategoryDto);
    if (parentId) {
      const parent = await this.categoryRepository.findOneBy({ id: parentId });
      newCategory.parent = parent;
    }
    return this.saveNewData(newCategory);
  }

  async findAllCategory(
    query: CommonQuery,
  ): Promise<ListResponseData<Category>> {
    const { page = 1, size = 10, searchKey = '' } = query;
    const result = await this.findAll(
      `SELECT * FROM category WHERE category.deleted_at IS NULL AND LOWER(category.name) LIKE LOWER('%${searchKey}%')`,
      page,
      size,
    );
    result.data = plainToInstance(Category, result.data);
    return result;
  }

  async findOneCategory(id: string): Promise<ResponseData<Category>> {
    const result = await this.findById(id, EEntityName.CATEGORY);
    result.data = plainToInstance(Category, result.data);
    return result;
  }

  async updateCategory(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<ResponseData<string>> {
    const { parentId, ...rest } = updateCategoryDto;
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
    const category = await this.categoryRepository.findOneBy({ id });
    category.childs = [];
    return await this.removeData(category);
  }
}
