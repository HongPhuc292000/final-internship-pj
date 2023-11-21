import { Module } from '@nestjs/common';
import { VariantAtributeService } from './variant-atribute.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VariantAtribute } from './entities/variant-atribute.entity';
import { AtributeModule } from '../atribute/atribute.module';
import { AtributeOptionModule } from '../atribute-option/atribute-option.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([VariantAtribute]),
    AtributeModule,
    AtributeOptionModule,
  ],
  providers: [VariantAtributeService],
  exports: [VariantAtributeService],
})
export class VariantAtributeModule {}
