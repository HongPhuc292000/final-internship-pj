import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  HttpException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { DataSource, QueryFailedError, Repository } from 'typeorm';
import { ResponseData } from 'src/types';
import { BaseService } from 'src/services/base-crud.service';
import { CategoryService } from '../category/category.service';
import { AtributeService } from '../atribute/atribute.service';
import { AtributeOptionService } from '../atribute-option/atribute-option.service';
import { VariantService } from '../variant/variant.service';

@Injectable()
export class ProductService extends BaseService<Product> {
  constructor(
    @InjectRepository(Product) private productRepository: Repository<Product>,
    private categoryService: CategoryService,
    private variantService: VariantService,
    private atributeService: AtributeService,
    private atributeOptionService: AtributeOptionService,
    private dataSource: DataSource,
  ) {
    super(productRepository);
  }

  async createNewProduct(createProductDto: CreateProductDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const { categoryId, variants, ...rest } = createProductDto;
      const category = await this.categoryService.findExistedData(
        { id: categoryId },
        'category',
      );
      await this.checkUniqueFieldDataIsUsed(
        { name: rest.name },
        'in this category, product name',
      );

      // handle product
      const newProduct = this.productRepository.create(rest);
      newProduct.category = category;

      // handle variant
      const variantsToCreate =
        await this.variantService.addNewMultipleVariant(variants);
      newProduct.productVariants = variantsToCreate;

      await queryRunner.commitTransaction();
      return this.addNewDataWithResponse(newProduct);
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new HttpException(err.response, err.status);
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
