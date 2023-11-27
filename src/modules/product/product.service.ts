import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
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

  async addNewVariantToProduct(
    productId: string,
    createVariantDto: CreateVariantDto,
  ) {
    const { set, imageUrl, ...rest } = createVariantDto;
    const createdVariant = await this.variantService.addNewVariant({
      productId,
      ...rest,
    });
    await this.imageLinkService.addNewImageLink({
      imageUrl,
      variantId: createdVariant.id,
    });

    set.forEach(async (item) => {
      await this.variantAtributeService.addNewVariantAtribute({
        variantId: createdVariant.id,
        atributeId: item.atribute,
        atributeOptionId: item.atributeOption,
      });
    });
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

      const createdProduct = await this.productRepository.save(newProduct);

      // handle images
      imageUrls.forEach(
        async (productImageUrl) =>
          await this.imageLinkService.addNewImageLink({
            productId: createdProduct.id,
            imageUrl: productImageUrl,
          }),
      );

      // handle variant
      variants.forEach(async (variant) => {
        await this.addNewVariantToProduct(createdProduct.id, variant);
      });

      await queryRunner.commitTransaction();
      return new ResponseData(createdProduct.id, HttpStatus.CREATED);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      error.response = { message: error.message };
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
            await this.imageLinkService.addNewImageLink({
              productId: product.id,
              imageUrl: productImageUrl,
            }),
        );

        const updatedImages = await Promise.all(newImageUrls);
        product.imageLinks = updatedImages;
      }

      const savedProduct = await this.productRepository.save({
        ...product,
        ...rest,
      });

      if (variants) {
        variants.forEach(async (variant) => {
          const { id, set, imageUrl, ...rest } = variant;
          if (variant.id) {
            const createdVariant = await this.variantService.findExistedData(
              {
                relations: { image: true },
                where: { id: variant.id },
              },
              'variant',
            );
            // handleImage
            const oldImageId = createdVariant.image.id;
            if (imageUrl) {
              const newImageUrl = await this.imageLinkService.addNewImageLink({
                imageUrl: imageUrl,
              });
              createdVariant.image = newImageUrl;
              await this.variantService.saveData({
                ...createdVariant,
                ...rest,
              });
              const oldImage = await this.imageLinkService.findExistedData({
                where: { id: oldImageId },
              });
              await this.imageLinkService.removeData(oldImage);
            }

            // handle set
            if (set) {
              set.forEach(async (item) => {
                const { atribute, atributeOption } = item;
                if (item.id) {
                  const existedVariantAtribute =
                    await this.variantAtributeService.findExistedData({
                      relations: {
                        atribute: true,
                        atributeOption: true,
                      },
                      where: { id: item.id },
                    });

                  const newAributeOption = {
                    atributeOptionId: atributeOption
                      ? atributeOption
                      : existedVariantAtribute.atributeOption.id,
                    atributeId: atribute
                      ? atribute
                      : existedVariantAtribute.atribute.id,
                  };

                  const checkExistedAtributeOption =
                    await this.atributeOptionService.checkExistedDataBoolean({
                      relations: { atribute: true },
                      where: {
                        id: newAributeOption.atributeOptionId,
                        atribute: {
                          id: newAributeOption.atributeId,
                        },
                      },
                    });

                  if (!checkExistedAtributeOption) {
                    throw new BadRequestException({
                      message: 'atribute and option are not match',
                    });
                  }

                  existedVariantAtribute.atribute.id =
                    newAributeOption.atributeId;
                  existedVariantAtribute.atributeOption.id =
                    newAributeOption.atributeOptionId;

                  await this.variantAtributeService.saveData(
                    existedVariantAtribute,
                  );
                } else {
                  await this.variantAtributeService.addNewVariantAtribute({
                    variantId: createdVariant.id,
                    atributeId: atribute,
                    atributeOptionId: atributeOption,
                  });
                }
              });
            }
          } else {
            await this.addNewVariantToProduct(
              savedProduct.id,
              variant as CreateVariantDto,
            );
          }
        });
      }

      await queryRunner.commitTransaction();
      return new ResponseData(product.id);
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

  async removeProduct(id: string) {
    const product = await this.findExistedData({ where: { id } });
    const result = await this.softRemoveData(product);
    return result;
  }
}
