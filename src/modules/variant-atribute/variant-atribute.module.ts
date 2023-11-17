import { Module } from '@nestjs/common';
import { VariantAtributeService } from './variant-atribute.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VariantAtribute } from './entities/variant-atribute.entity';

@Module({
  imports: [TypeOrmModule.forFeature([VariantAtribute])],
  providers: [VariantAtributeService],
  exports: [VariantAtributeService],
})
export class VariantAtributeModule {}
