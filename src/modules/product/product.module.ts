import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { CategoryModule } from '../category/category.module';
import { AtributeModule } from '../atribute/atribute.module';
import { AtributeOptionModule } from '../atribute-option/atribute-option.module';
import { VariantModule } from '../variant/variant.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product]),
    CategoryModule,
    AtributeModule,
    AtributeOptionModule,
    VariantModule,
  ],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
