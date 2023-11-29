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
        'in this category, product name',
      );
      const newProduct = this.productRepository.create({ ...rest, category });

      const createdProduct = await queryRunner.manager.save(newProduct);

      // handle images
      imageUrls.forEach(
        async (productImageUrl) =>
          await this.imageLinkService.addNewImageLink(queryRunner, {
            productId: createdProduct.id,
            imageUrl: productImageUrl,
          }),
      );

      // handle variant
      const variantsCreated = await Promise.all(
        variants.map(
          async (variant) =>
            await this.variantService.addNewVariantToProduct(
              queryRunner,
              createdProduct.id,
              variant,
            ),
        ),
      );

      // handle image in variant
      await Promise.all(
        variantsCreated.map(async (variantImage) => {
          await this.imageLinkService.addNewImageLink(queryRunner, {
            imageUrl: variantImage.imageUrl,
            variantId: variantImage.variantId,
          });
        }),
      );

      // handle variant atribute in variant
      const listVariantAtributes = variantsCreated
        .map((variantCreated) => {
          return variantCreated.set;
        })
        .flat();
      await Promise.all(
        listVariantAtributes.map(async (variantAtribute) => {
          await this.variantAtributeService.addNewVariantAtribute(queryRunner, {
            variantId: variantAtribute.variantId,
            atributeId: variantAtribute.atribute,
            atributeOptionId: variantAtribute.atributeOption,
          });
        }),
      );

      await queryRunner.commitTransaction();
      return new ResponseData(createdProduct.id, HttpStatus.CREATED);
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
          where: { id },
        },
        'product',
      );

      const { categoryId, imageUrls, variants, ...rest } = updateProductDto;

      if (categoryId) {
        const newCategory = await this.categoryService.findExistedData(
          { where: { id: categoryId } },
          'category',
        );

        product.category = newCategory;
      }

      // handle images
      if (imageUrls) {
        const newImageUrls = imageUrls.map(
          async (productImageUrl) =>
            await this.imageLinkService.addNewImageLink(queryRunner, {
              productId: product.id,
              imageUrl: productImageUrl,
            }),
        );

        const updatedImages = await Promise.all(newImageUrls);
        product.imageLinks = updatedImages;
      }
      product.name = rest.name || product.name;
      product.description = rest.description || product.description;

      const savedProduct = await queryRunner.manager.save(product);

      if (variants) {
        const updatedVariants = await Promise.all(
          variants.map(async (variant) => {
            if (variant.id) {
              return await this.variantService.updateVariantToProduct(
                queryRunner,
                variant,
              );
            } else {
              return await this.variantService.addNewVariantToProduct(
                queryRunner,
                savedProduct.id,
                variant as CreateVariantDto,
              );
            }
          }),
        );

        // handle image in variant
        await Promise.all(
          updatedVariants.map(async (variantImage) => {
            const { variantId, imageUrl } = variantImage;

            if (imageUrl) {
              await this.imageLinkService.addNewImageLink(queryRunner, {
                imageUrl,
                variantId,
              });
            }
          }),
        );

        const listVariantAtributes = updatedVariants
          .map((updatedVariant) => {
            return updatedVariant.set;
          })
          .flat();

        await Promise.all(
          listVariantAtributes.map(async (variantAtribute) => {
            if (variantAtribute) {
              const { variantId, atribute, atributeOption, id } =
                variantAtribute;
              if (id) {
                await this.variantAtributeService.updateVariantAtribute(
                  queryRunner,
                  {
                    id,
                    variantId: variantId,
                    atributeId: atribute,
                    atributeOptionId: atributeOption,
                  },
                );
              } else {
                await this.variantAtributeService.addNewVariantAtribute(
                  queryRunner,
                  {
                    variantId: variantId,
                    atributeId: atribute,
                    atributeOptionId: atributeOption,
                  },
                );
              }
            }
          }),
        );
      }

      await queryRunner.commitTransaction();
      return new ResponseData(product.id);
    } catch (error) {
      console.log(error);

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
    const product = await this.findExistedData({ where: { id } });
    const result = await this.softRemoveData(product);
    return result;
  }
}
