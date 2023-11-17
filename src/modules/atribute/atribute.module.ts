import { Module } from '@nestjs/common';
import { AtributeService } from './atribute.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Atribute } from './entities/atribute.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Atribute])],
  providers: [AtributeService],
  exports: [AtributeService],
})
export class AtributeModule {}
