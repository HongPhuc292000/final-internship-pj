import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';
import { BaseService } from 'src/services/base-crud.service';
import { ResponseData } from 'src/types';
import { IProductQuery } from 'src/types/Query';
import { DataSource, FindManyOptions, Like, Repository } from 'typeorm';
import { AtributeOptionService } from '../atribute-option/atribute-option.service';
import { CategoryService } from '../category/category.service';
import { ImageLinkService } from '../image-link/image-link.service';
import { VariantAtributeService } from '../variant-atribute/variant-atribute.service';
import { CreateVariantDto } from '../variant/dto/createVariant.dto';
import { VariantService } from '../variant/variant.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { ResponseDetailProduct } from './types/DetailProductResponse';
import { ListProductResponse } from './types/ListProductResponse.type';

@Injectable()
export class ProductService extends BaseService<Product> {
  constructor(
    @InjectRepository(Product) private productRepository: Repository<Product>,
    private atributeOptionService: AtributeOptionService,
    private categoryService: CategoryService,
    private variantService: VariantService,
    private imageLinkService: ImageLinkService,
    private variantAtributeService: VariantAtributeService,
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
        'product name',
      );
      const newProduct = this.productRepository.create({ ...rest, category });

      // handle images
      const createdProductImages = imageUrls.map((productImageUrl) =>
        this.imageLinkService.createImageLink(productImageUrl),
      );
      newProduct.imageLinks = createdProductImages;

      // handle variant
      const createdVariants = await Promise.all(
        variants.map((variant) => {
          return this.variantService.createNewVariant(variant);
        }),
      );
      newProduct.productVariants = createdVariants;

      const savedProduct = await queryRunner.manager.save(newProduct);

      await queryRunner.commitTransaction();
      return new ResponseData(savedProduct.id, HttpStatus.CREATED);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new HttpException(error.response, error.status);
    } finally {
      await queryRunner.release();
    }
  }

  async updateProduct(id: string, updateProductDto: UpdateProductDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      let product = await this.findExistedData(
        {
          relations: { productVariants: true },
          where: { id },
        },
        'product',
      );

      const { categoryId, imageUrls, variants, name, ...rest } =
        updateProductDto;

      product.description = rest.description || product.description;
      if (name) {
        await this.checkUniqueFieldDataIsUsed(
          { where: { name } },
          'product name',
          id,
        );
        product.name = name || product.name;
      }

      if (categoryId) {
        const newCategory = await this.categoryService.findExistedData(
          { where: { id: categoryId } },
          'category',
        );

        product.category = newCategory;
      }

      // handle images
      if (imageUrls) {
        const createdProductImages = imageUrls.map((productImageUrl) =>
          this.imageLinkService.createImageLink(productImageUrl),
        );
        product.imageLinks = createdProductImages;
      }

      // handle variant
      if (variants) {
        const updatedVariants = await Promise.all(
          variants.map((variant) => {
            return this.variantService.updateVariant(variant);
          }),
        );
        const oldProductVariants = product.productVariants;
        var ids = new Set(updatedVariants.map((d) => d.id));
        var mergedProductVariants = [
          ...updatedVariants,
          ...oldProductVariants.filter((d) => !ids.has(d.id)),
        ];

        product.productVariants = mergedProductVariants;
      }

      const savedProduct = await queryRunner.manager.save(product);

      await queryRunner.commitTransaction();
      return new ResponseData(savedProduct.id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
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

  async removeProduct(id: string) {
    const product = await this.findExistedData({ where: { id } }, 'product');
    const result = await this.softRemoveData(product);
    return result;
  }
}
