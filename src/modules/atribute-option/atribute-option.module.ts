import { Module } from '@nestjs/common';
import { AtributeOptionService } from './atribute-option.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AtributeOption } from './entities/atribute-option.entity';
import { AtributeOptionController } from './atribute-option.controller';
import { Atribute } from '../atribute/entities/atribute.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AtributeOption, Atribute])],
  providers: [AtributeOptionService],
  exports: [AtributeOptionService],
  controllers: [AtributeOptionController],
})
export class AtributeOptionModule {}
