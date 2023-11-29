import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Param,
  ParseUUIDPipe,
  Patch,
  Delete,
} from '@nestjs/common';
import { ICommonQuery } from 'src/types/Query';
import { AtributeOptionService } from './atribute-option.service';
import { CreateMultipleAtributeOptionDto } from './dto/createAtributeOption.dto';
import { UpdateAtributeOptionDto } from './dto/updateAtributeOption.dto';

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

  @Get(':id')
  getById(@Param('id', ParseUUIDPipe) id: string) {
    return this.atributeOptionService.findRecordWithResponse(
      { where: { id } },
      'atribute option',
    );
  }

  @Patch(':id')
  updateOne(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateAtributeOptionDto: UpdateAtributeOptionDto,
  ) {
    return this.atributeOptionService.updateAtribute(
      id,
      updateAtributeOptionDto,
    );
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.atributeOptionService.removeAtributeOption(id);
  }
}
