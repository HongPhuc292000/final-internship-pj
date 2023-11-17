import { Module } from '@nestjs/common';
import { AtributeOptionService } from './atribute-option.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AtributeOption } from './entities/atribute-option.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AtributeOption])],
  providers: [AtributeOptionService],
  exports: [AtributeOptionService],
})
export class AtributeOptionModule {}
