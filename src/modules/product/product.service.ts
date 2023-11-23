import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';
import { BaseService } from 'src/services/base-crud.service';
import { ResponseData } from 'src/types';
import { DataSource, FindManyOptions, Like, Repository } from 'typeorm';
import { CategoryService } from '../category/category.service';
import { ImageLinkService } from '../image-link/image-link.service';
import { VariantService } from '../variant/variant.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { ResponseDetailProduct } from './types/DetailProductResponse';
import { IProductQuery } from 'src/types/Query';
import { ListProductResponse } from './types/ListProductResponse.type';

@Injectable()
export class ProductService extends BaseService<Product> {
  constructor(
    @InjectRepository(Product) private productRepository: Repository<Product>,
    private categoryService: CategoryService,
    private variantService: VariantService,
    private imageLinkService: ImageLinkService,
    private dataSource: DataSource,
  ) {
    super(productRepository);
  }

  async createNewProduct(createProductDto: CreateProductDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const { categoryId, variants, imageUrls, ...rest } = createProductDto;
      const category = await this.categoryService.findExistedData(
        { where: { id: categoryId } },
        'category',
      );
      await this.checkUniqueFieldDataIsUsed(
        { where: { name: rest.name } },
        'in this category, product name',
      );

      // handle product
      const newProduct = this.productRepository.create(rest);
      newProduct.category = category;

      // handle images
      const imagesToCreate = this.imageLinkService.createMultipleImageLink({
        imageUrls,
      });
      newProduct.imageLinks = imagesToCreate;

      // handle variant
      const variantsToCreate =
        await this.variantService.addNewMultipleVariant(variants);
      newProduct.productVariants = variantsToCreate;

      await queryRunner.commitTransaction();
      return this.addNewDataWithResponse(newProduct);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      error.response = { message: error.message };
      throw new HttpException(error.response, error.status);
    } finally {
      await queryRunner.release();
    }
  }

  async findAllProduct(query: IProductQuery) {
    const { categoryId, searchKey = '', ...rest } = query;
    const specifiedOptions: FindManyOptions<Product> = {
      relations: {
        imageLinks: true,
        productVariants: true,
      },
      where: {
        category: { id: categoryId },
        name: Like(`%${searchKey}%`),
      },
    };

    const result = await this.handleCommonQueryRepo(specifiedOptions, rest);
    const newData = plainToClass(ListProductResponse, result.data);

    return {
      ...result,
      data: newData,
    };
  }

  async findOneProductById(id: string) {
    const product = await this.findExistedData(
      {
        relations: {
          category: true,
          imageLinks: true,
          productVariants: {
            image: true,
            variantAtributes: {
              atribute: true,
              atributeOption: true,
            },
          },
        },
        where: { id },
        withDeleted: true,
      },
      'product',
    );

    const newData = plainToClass(ResponseDetailProduct, product);
    return new ResponseData(newData);
  }

  async updateProduct(id: string, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  async removeProduct(id: string) {
    const product = await this.findExistedData({ where: { id } });
    const result = await this.softRemoveData(product);
    return result;
  }
}
