import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ICommonQuery } from 'src/types/Query';
import { AtributeOptionService } from './atribute-option.service';
import { CreateMultipleAtributeOptionDto } from './dto/createAtributeOption.dto';

@Controller('atribute-option')
export class AtributeOptionController {
  constructor(private atributeOptionService: AtributeOptionService) {}
  @Post()
  create(
    @Body() createMultipleAtributeOptionDto: CreateMultipleAtributeOptionDto,
  ) {
    return this.atributeOptionService.addNewAtributeOption(
      createMultipleAtributeOptionDto,
    );
  }

  @Get()
  findAll(@Query() query: ICommonQuery) {
    return this.atributeOptionService.findAllAtributeOption(query);
  }
}
