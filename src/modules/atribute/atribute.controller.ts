import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { AtributeService } from './atribute.service';
import { CreateAtributeDto } from './dto/createAtribute.dto';
import { ICommonQuery } from 'src/types/Query';

@Controller('atribute')
export class AtributeController {
  constructor(private atributeService: AtributeService) {}
  @Post()
  create(@Body() createAtributeDto: CreateAtributeDto) {
    return this.atributeService.addNewAtribute(createAtributeDto);
  }

  @Get()
  findAll(@Query() query: ICommonQuery) {
    return this.atributeService.findAllAtribute(query);
  }
}
