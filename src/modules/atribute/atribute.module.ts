import { Module } from '@nestjs/common';
import { AtributeService } from './atribute.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Atribute } from './entities/atribute.entity';
import { AtributeController } from './atribute.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Atribute])],
  providers: [AtributeService],
  exports: [AtributeService],
  controllers: [AtributeController],
})
export class AtributeModule {}
