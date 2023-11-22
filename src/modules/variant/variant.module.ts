import { Module } from '@nestjs/common';
import { VariantService } from './variant.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Variant } from './entities/variant.entity';
import { VariantAtributeModule } from '../variant-atribute/variant-atribute.module';
import { ImageLinkModule } from '../image-link/image-link.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Variant]),
    VariantAtributeModule,
    ImageLinkModule,
  ],
  providers: [VariantService],
  exports: [VariantService],
})
export class VariantModule {}
