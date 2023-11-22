import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/services/base-crud.service';
import { DataSource, Repository } from 'typeorm';
import { CategoryService } from '../category/category.service';
import { ImageLinkService } from '../image-link/image-link.service';
import { VariantService } from '../variant/variant.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';

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

  findAllProduct() {
    return `This action returns all product`;
  }

  findOneProductById(id: string) {
    const product = this.productRepository.findOne({
      where: { id },
      relations: {
        category: true,
        productVariants: {
          variantAtributes: {
            atribute: true,
            atributeOption: true,
          },
        },
      },
    });
    return product;
  }

  updateProduct(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  removeProduct(id: number) {
    return `This action removes a #${id} product`;
  }
}
