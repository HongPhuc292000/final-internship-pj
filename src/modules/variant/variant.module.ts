import { Module } from '@nestjs/common';
import { VariantService } from './variant.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Variant } from './entities/variant.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Variant])],
  providers: [VariantService],
  exports: [VariantService],
})
export class VariantModule {}
