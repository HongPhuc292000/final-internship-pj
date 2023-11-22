import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { APP_FILTER } from '@nestjs/core';
import { TypeOrmConfigService } from './services/typeorm-config.service';
import { CategoryModule } from './modules/category/category.module';
import databaseConfig from './configs/typeorm.config';
import { AnyExceptionFilter } from './filters/any-exception.filter';
import { VariantModule } from './modules/variant/variant.module';
import { AtributeModule } from './modules/atribute/atribute.module';
import { AtributeOptionModule } from './modules/atribute-option/atribute-option.module';
import { VariantAtributeModule } from './modules/variant-atribute/variant-atribute.module';
import { ProductModule } from './modules/product/product.module';
import { ImageLinkModule } from './modules/image-link/image-link.module';

const ENV = process.env.NODE_ENV;

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      envFilePath: !ENV ? '.env.dev' : `.env.${ENV}`,
      isGlobal: true,
      load: [databaseConfig],
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
    }),
    CategoryModule,
    VariantModule,
    AtributeModule,
    AtributeOptionModule,
    VariantAtributeModule,
    ProductModule,
    ImageLinkModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AnyExceptionFilter,
    },
  ],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
