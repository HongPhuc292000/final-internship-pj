import { Module } from '@nestjs/common';
import { VariantService } from './variant.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Variant } from './entities/variant.entity';
import { VariantAtributeModule } from '../variant-atribute/variant-atribute.module';

@Module({
  imports: [TypeOrmModule.forFeature([Variant]), VariantAtributeModule],
  providers: [VariantService],
  exports: [VariantService],
})
export class VariantModule {}
