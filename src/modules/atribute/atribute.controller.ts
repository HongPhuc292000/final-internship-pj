import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  Param,
  ParseUUIDPipe,
  Patch,
  Delete,
} from '@nestjs/common';
import { AtributeService } from './atribute.service';
import { CreateAtributeDto } from './dto/createAtribute.dto';
import { ICommonQuery } from 'src/types/Query';
import { UpdateAtributeDto } from './dto/updateAtribute.dto';

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

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateAtributeDto: UpdateAtributeDto,
  ) {
    return this.atributeService.updateAtribute(id, updateAtributeDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.atributeService.removeAtribute(id);
  }
}
